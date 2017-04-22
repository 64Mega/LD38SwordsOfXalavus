// Player Handler

import * as maps from "./map";
import * as util from "../util";
import * as assets from "../assets";
import * as input from "../input";
import * as combat from "./combat";
import * as messagelog from "./messagelog";
import * as enemies from "./enemy";
import * as gamestate from "./gamestate";
import * as inventory from "./inventory";
import * as things from "./things";
import * as effects from "./fx";

let x: number = 0;
let y: number = 0;

let cursor_x = 0;
let cursor_y = 0;

enum MODES {
    NORMAL = 0,
    ATTACK,
    LOOK,
    GET
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

let equipment = {
    armor: {
        name: "Plain Clothes",
        def: 0    
    },
    weapon: {
        name: "Bare Fists",
        atk: 1,
        range: 1
    }
};

// Functions

export function equip_armor(armor: any) {
    equipment.armor = armor;
}

export function equip_weapon(weapon: any) {
    equipment.weapon = weapon;
}

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

export function hurt(amount: number) {
    let val = Math.max(0, amount - equipment.armor.def);
    messagelog.push(`Took ${val} damage`);
    stats.hp -= val;
}

// TODO: Add death system

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
        } else if(input.key_pressed(input.KEY.L)) {
            mode = MODES.LOOK;
            messagelog.push("Look around with arrow keys");
            cursor_x = x;
            cursor_y = y;
            return false;
        } else if(input.key_pressed(input.KEY.G)) {
            mode = MODES.GET;
            messagelog.push("Get with arrow keys");
            cursor_x = x;
            cursor_y = y;
            return false;
        } else if(input.key_pressed(input.KEY.I)) {
            gamestate.set_state(gamestate.STATES.INVENTORY);
            return false;
        }
    } 
    if(mode === MODES.LOOK) {
        if(input.key_pressed(input.KEY.ESCAPE) ||
            input.key_pressed(input.KEY.BACKSPACE)) {
                mode = MODES.NORMAL;
                messagelog.push("Look mode canceled");
            }

            if(input.key_pressed(input.KEY.ENTER) || 
        input.key_pressed(input.KEY.L)) {
            let edx = Math.abs((x+maps.get_offset().x) - (cursor_x+maps.get_offset().x));
            let edy = Math.abs((y+maps.get_offset().y) - (cursor_y+maps.get_offset().y));
            if(edx <= 1 && edy <= 1) {
                let enm = enemies.get_at_position(cursor_x+maps.get_offset().x, cursor_y+maps.get_offset().y);
                if(enm) {
                    messagelog.push(`You see a ${enm.detail}`);
                } else {
                    let thing = things.is_thing(cursor_x+maps.get_offset().x, cursor_y+maps.get_offset().y);
                    if(thing === true) {
                        things.look(cursor_x+maps.get_offset().x, cursor_y+maps.get_offset().y);
                    } else {
                        messagelog.push(`You see nothing of interest`);
                    }
                } 
            } else {
                messagelog.push("Get closer first!");
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
    if(mode === MODES.GET) {
        if(input.key_pressed(input.KEY.ESCAPE) ||
            input.key_pressed(input.KEY.BACKSPACE)) {
                mode = MODES.NORMAL;
                messagelog.push("Get mode canceled");
            }

            if(input.key_pressed(input.KEY.ENTER) || 
        input.key_pressed(input.KEY.G)) {
            let edx = Math.abs((x+maps.get_offset().x) - (cursor_x+maps.get_offset().x));
            let edy = Math.abs((y+maps.get_offset().y) - (cursor_y+maps.get_offset().y));
            if(edx <= 1 && edy <= 1) {
                let thing = things.is_thing(cursor_x+maps.get_offset().x, cursor_y+maps.get_offset().y);
                if(thing === true) {
                    things.get(cursor_x+maps.get_offset().x, cursor_y+maps.get_offset().y);
                } else {
                    messagelog.push(`You can't take that!`);
                } 
            } else {
                messagelog.push("Too far away!");
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
    if(mode === MODES.ATTACK) {
        if(input.key_pressed(input.KEY.ESCAPE) ||
            input.key_pressed(input.KEY.BACKSPACE)) {
                mode = MODES.NORMAL;
                messagelog.push("Attack mode canceled");
            }

        if(input.key_pressed(input.KEY.ENTER) || 
        input.key_pressed(input.KEY.A)) {
            let enm = enemies.get_at_position(cursor_x+maps.get_offset().x, cursor_y+maps.get_offset().y);
            if(enm) {
                let edx = Math.abs((x+maps.get_offset().x) - enm.x);
                let edy = Math.abs((y+maps.get_offset().y) - enm.y);
                if(edx <= equipment.weapon.range && edy <= equipment.weapon.range) {
                    let dmg = equipment.weapon.atk;
                    if(equipment.weapon["ammotype"] !== undefined) {
                        // Uses ammo
                        let ammo = inventory.get(equipment.weapon["ammotype"]);
                        if(ammo) {
                            enemies.damage(enm, dmg);
                            effects.hit(cursor_x*16, cursor_y*16);
                            messagelog.push(`You let loose an ${ammo.name} with your ${equipment.weapon.name}`);
                            messagelog.push(`You hit the ${enm.name}`);
                            messagelog.push(`Dealt ${dmg} damage!`);
                        } else {
                            messagelog.push(`You haven't any ammunition for your ${equipment.weapon.name}`);
                        }
                    } else {
                        enemies.damage(enm, dmg);
                        effects.hit(cursor_x*16, cursor_y*16);
                        messagelog.push(`You attack the ${enm.name} with your ${equipment.weapon.name}`);
                        messagelog.push(`Dealt ${dmg} damage!`);
                    }
                } else {
                    messagelog.push(`The ${enm.name} is out of reach!`);
                    messagelog.push(`You miss!`);
                }
            } else {
                if(x === cursor_x && y === cursor_y) {
                    messagelog.push(`Your attack yourself with your ${equipment.weapon.name}`);
                    let dmg = equipment.weapon.atk;
                    stats.hp -= dmg;
                    effects.hit(cursor_x*16, cursor_y*16);
                    messagelog.push(`Dealt ${dmg} damage to self.`);
                } else {
                    if(things.is_thing(cursor_x+maps.get_offset().x, cursor_y+maps.get_offset().y)) {
                        effects.hit(cursor_x*16, cursor_y*16);
                        things.attack(cursor_x+maps.get_offset().x, cursor_y+maps.get_offset().y);
                    } else {
                        messagelog.push("Critical miss!");
                    }
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
    if(mode === MODES.LOOK) {
        util.draw_sprite("ui/cursor/select", cursor_x*16, cursor_y*16);
    }
    if(mode === MODES.GET) {
        util.draw_sprite("ui/cursor/select", cursor_x*16, cursor_y*16);
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
    util.draw_highlight_text(208, 96, "Enter", "slategray");
    util.draw_highlight_text(208, 104, "Get", "white");
}