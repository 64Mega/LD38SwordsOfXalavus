// Player Handler

import * as maps from "./map";
import * as util from "../util";
import * as assets from "../assets";
import * as input from "../input";
import * as combat from "./combat";
import * as messagelog from "./messagelog";
import * as enemies from "./enemy";
import * as gamestate from "./gamestate";

let x: number = 0;
let y: number = 0;

let cursor_x = 0;
let cursor_y = 0;

enum MODES {
    NORMAL = 0,
    ATTACK,
    LOOK
};

let mode = MODES.NORMAL;

// Stats 
let stats = {
    hp: 10, maxhp: 10,
    mp: 5, maxmp: 5,
    str: 2,
    def: 1,
    dex: 1,
    mag: 1,
    gold: 0
}

// Functions

export function init(xpos: number, ypos: number) {
    setpos(xpos, ypos);
}

export function setpos(xpos: number, ypos: number) {
    x = xpos;
    y = ypos;
}

export function getpos() {
    return {
        "x": x,
        "y": y
    }
}

export function heal(amount: number) {
    let a = stats.maxhp - stats.hp; 
    stats.hp += amount;
    if(stats.hp > stats.maxhp) { stats.hp = stats.maxhp; }
    let b = stats.maxhp - stats.hp;
    b = Math.abs(b-a);
    messagelog.push(`Healed ${b} HP!`);
}

export function give_gold(amount: number) {
    stats.gold += amount;
}

export function update_occupy() {
    maps.occupy(x + maps.get_offset().x, y + maps.get_offset().y);
}

export function update() {
    if(mode === MODES.NORMAL) {
        if(input.key_pressed(input.KEY.LEFT)) {
            move_left();
            return true;
        } else if(input.key_pressed(input.KEY.RIGHT)) {
            move_right();
            return true;
        } else if(input.key_pressed(input.KEY.UP)) {
            move_up();
            return true;
        } else if(input.key_pressed(input.KEY.DOWN)) {
            move_down();
            return true;
        } else if(input.key_pressed(input.KEY.A)) {
            mode = MODES.ATTACK;
            messagelog.push("Choose a target with arrow keys");
            cursor_x = x;
            cursor_y = y;
            return false;
        } else if(input.key_pressed(input.KEY.I)) {
            gamestate.set_state(gamestate.STATES.INVENTORY);
            return false;
        }
    } 
    if(mode === MODES.ATTACK) {
        if(input.key_pressed(input.KEY.ESCAPE) ||
            input.key_pressed(input.KEY.BACKSPACE)) {
                mode = MODES.NORMAL;
                messagelog.push("Attack canceled");
            }

        if(input.key_pressed(input.KEY.ENTER) || 
        input.key_pressed(input.KEY.A)) {
            let enm = enemies.get_at_position(cursor_x+maps.get_offset().x, cursor_y+maps.get_offset().y);
            console.log(enm);
            if(enm) {
                let edx = Math.abs((x+maps.get_offset().x) - enm.x);
                let edy = Math.abs((y+maps.get_offset().y) - enm.y);
                if(edx <= 1 && edy <= 1) {
                    let dmg = stats.str + stats.dex;
                    enemies.damage(enm, dmg);
                    messagelog.push(`You attack the ${enm.name}`);
                    messagelog.push(`Dealt ${dmg} damage!`);
                } else {
                    messagelog.push(`The ${enm.name} is out of reach!`);
                    messagelog.push(`You miss!`);
                }
            } else {
                if(x === cursor_x && y === cursor_y) {
                    messagelog.push("Your smack yourself with your weapon");
                    let dmg = stats.str + stats.dex;
                    stats.hp -= dmg;
                    messagelog.push(`Dealt ${dmg} damage to self.`);
                } else {
                    messagelog.push("Critical miss!");
                }
            }
                mode = MODES.NORMAL;
                return true;
        }

        if(input.key_pressed(input.KEY.LEFT)) {
            if(cursor_x > 0) { cursor_x -= 1; }
        }
        if(input.key_pressed(input.KEY.RIGHT)) {
            if(cursor_x < 11) { cursor_x += 1; }
        }
        if(input.key_pressed(input.KEY.UP)) {
            if(cursor_y > 0) { cursor_y -= 1; }
        }
        if(input.key_pressed(input.KEY.DOWN)) {
            if(cursor_y < 11) { cursor_y += 1; }
        }  
    }

    return false;
}

export function update_screen() {
    let m = maps.get_offset();
    if(x < 0 && m.x >= 12) {
        x = 11;
        m.x -= 12;
    }
    if(x >= 12) {
        x = 0;
        m.x += 12;
    }
    if(y < 0 && m.y >= 12) {
        y = 11;
        m.y -= 12;
    }
    if(y >= 12) {
        y = 0;
        m.y += 12;
    }
    maps.occupy(x+m.x, y+m.y);
    maps.set_offset(m.x, m.y);
}

export function move_left() {
    if(!maps.is_occupied(x+maps.get_offset().x-1, y+maps.get_offset().y) && 
        maps.is_passable(x+maps.get_offset().x-1, y+maps.get_offset().y)) {
        x -= 1;
        maps.occupy(x+maps.get_offset().x, y+maps.get_offset().y);
    }
}

export function move_right() {
    if(!maps.is_occupied(x+maps.get_offset().x+1, y+maps.get_offset().y) && 
        maps.is_passable(x+maps.get_offset().x+1, y+maps.get_offset().y)) {
        x += 1;
        maps.occupy(x+maps.get_offset().x, y+maps.get_offset().y);
    }
}

export function move_up() {
    if(!maps.is_occupied(x+maps.get_offset().x, y+maps.get_offset().y-1) && 
        maps.is_passable(x+maps.get_offset().x, y+maps.get_offset().y-1)) {
        y -= 1;
        maps.occupy(x+maps.get_offset().x, y+maps.get_offset().y);
    }
}

export function move_down() {
    if(!maps.is_occupied(x+maps.get_offset().x, y+maps.get_offset().y+1) && 
        maps.is_passable(x+maps.get_offset().x, y+maps.get_offset().y+1)) {
        y += 1;
        maps.occupy(x+maps.get_offset().x, y+maps.get_offset().y);
    }
}

export function draw() {
    util.draw_sprite("chars/player", x*16, y*16);

    if(mode === MODES.ATTACK) {
        util.draw_sprite("ui/cursor/attack", cursor_x*16, cursor_y*16);
    }
}

export function draw_stats() {
    util.draw_text_inverted(200, 8, "PLAYER", "white");
    util.set_font("font/main");
    util.draw_text(208, 16, `HP: ${stats.hp}/${stats.maxhp}`);
    util.draw_text(208, 24, `MP: ${stats.mp}/${stats.maxmp}`);
    util.draw_text(208, 32, `STR: ${stats.str} DEX: ${stats.dex}`);
    util.draw_text(208, 40, `DEF: ${stats.def} MAG: ${stats.mag}`);
    util.draw_text(208, 48, `GOLD: ${stats.gold}`);

    // Draw commands
    util.draw_text(200, 64, "ACTIONS");
    util.set_font("font/main");
    util.draw_highlight_text(208, 72, "Attack", "white");
    util.draw_highlight_text(208, 80, "Look", "slategray");
    util.draw_highlight_text(208, 88, "Inventory", "white");
}