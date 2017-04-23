// 64Mega's Game Jam Quick-Start Kit
// See Readme.md or https://github.com/64Mega/GameJamStarterKit

import * as util from "./util";
import * as assets from "./assets";
import * as audio from "./audio";
import * as input from "./input";
import * as gamestate from "./game/gamestate";
import * as messagelog from "./game/messagelog";
import * as maps from './game/map';
import * as player from './game/player';
import * as enemy from './game/enemy';
import * as effects from './game/fx';
import * as inventory from "./game/inventory";
import * as message from "./game/message";
import * as things from "./game/things";
import * as gameoverstate from "./game/gameover";
import * as winscreen from "./game/winscreen";

let time = Date.now();
let time_last = Date.now();
let can_loop = false;
const SPEED_MOD = 50;
const PLAY_AREA_SIZE = 192;

function game_loop() {
    let now = Date.now();
    let delta = (now - time_last) / SPEED_MOD;

    if(assets.assets_loaded() && can_loop) {
        let current_state = gamestate.get_current_state();
        if(current_state && current_state.update) { current_state.update(delta); }
        if(current_state && current_state.render) { current_state.render(); }
    } else {
        if(can_loop) {
            let loaded = assets.get_assets_loaded();
            let num = assets.get_num_assets();
            render_load_screen(loaded, num);
        } else {
            wait_for_critical_resources();
        }
    }

    time_last = now;
    requestAnimationFrame(game_loop);
}

function render_load_screen(loaded : number, num : number) {
    let ctx = util.context;
    ctx.fillStyle = "#0A0A0A";
    ctx.imageSmoothingEnabled = false;
    ctx.fillRect(0,0,320,200);
    util.set_font("font/main");
    util.draw_text(0,0,`LOADING ASSETS ${loaded}/${num}, PLEASE WAIT`);
}

function wait_for_critical_resources() {
    // Waits for loading of critical resources
    let font = assets.image_get("font/main");
    if(font && font.ready) {
        util.set_font("font/main");
        can_loop = true;
    } 
}

let intro_message_shown = false;

function updateWorld(delta: number) {
    enemy.update(delta);
}

let started_music = false;

// Do your updates in this function
function update(delta : number) {
    if(started_music === false) {
        if(assets.sound_get("music").is_ready) {
            audio.play_music("music");
            started_music = true;
        }
    }
    maps.reset_occupied();
    player.update_occupy();
    enemy.update_occupy();
    effects.update(delta);
    things.update(delta);
    
    if(intro_message_shown === false) {
        gamestate.set_state(gamestate.STATES.MESSAGE);
        intro_message_shown = true;
        return;
    }

    if(player.update() === true) {
        updateWorld(delta);
    }

    player.update_screen();

}

// Do your rendering in this function
function render() {
    let ctx = util.context;

    // Clear screen

    util.draw_clear("#0A0A0A");

    // Block out play-area box
    util.draw_fillrect(0,0,PLAY_AREA_SIZE,PLAY_AREA_SIZE,"#0A0A0A");
    
    util.draw_border(0,PLAY_AREA_SIZE,40,6,"ui/border",true);
    util.draw_border(PLAY_AREA_SIZE, 0, 16, 24, "ui/border",true);
    
    util.draw_boxed_text(PLAY_AREA_SIZE+16, 0, "[PLAYER WINDOW]", "black");
    
    messagelog.draw(8,PLAY_AREA_SIZE+8);
    util.draw_border(0,PLAY_AREA_SIZE,40,6,"ui/border",false);
    util.draw_boxed_text(16,PLAY_AREA_SIZE,"[MESSAGE WINDOW]", "black");

    maps.render();
    enemy.render();
    things.render();
    player.draw();
    effects.render();
    
    player.draw_stats();
}

function main() {
    util.canvas_init(320, 240);

    loadAssets();
    input.init();
    maps.init();
    enemy.load();

    maps.switch_map("start");

    gamestate.bind_state(gamestate.STATES.DEBUG, update, render);
    gamestate.set_state(gamestate.STATES.DEBUG);
    inventory.bind();
    message.bind();
    message.clear();

    gameoverstate.bind();
    winscreen.bind();

    message.push("WELCOME TO SWORDS OF XALAVUS");
    message.push("Move around with arrows keys");
    message.push("Press L to look at things");
    message.push("Read the signs in the Western room for tips!");

    // Start game loop
    requestAnimationFrame(game_loop);
}

function loadAssets() {
    // Load some system-required assets
    assets.image_load("font/main", "data/images/ui/font.png");
    assets.image_load("font/inverted", "data/images/ui/font_inverted.png");
    assets.sound_load("snd/default", "data/sounds/select_default.wav");
    assets.sound_load("snd/hit", "data/sounds/hit2.wav");
    assets.sound_load("snd/walk", "data/sounds/walk.wav");
    assets.sound_load("music", "data/sounds/music.mp3");

    // Load rest of resources here
    assets.image_load("ui/border", "data/images/ui/ui_borders.png");
    assets.image_load("chars/player", "data/images/chars/player.png");
    assets.image_load("ui/cursor/attack", "data/images/ui/cursor_attack.png");
    assets.image_load("ui/cursor/select", "data/images/ui/cursor_select.png");
    assets.image_load("ui/cursor/magic", "data/images/ui/cursor_magic.png");
    assets.image_load("fx/hit", "data/images/fx/hit1.png");
    assets.image_load("fx/heal", "data/images/fx/heal.png");
    assets.image_load("thing/signpost", "data/images/things/signpost.png");
    assets.image_load("thing/pickup_default", "data/images/things/pickup_default.png");
    assets.image_load("thing/bed", "data/images/things/bed.png");
    assets.image_load("thing/bookshelf", "data/images/things/bookshelf.png");
    assets.image_load("thing/cupboard", "data/images/things/cupboard1.png");
    assets.image_load("thing/chest", "data/images/things/chest.png");
    assets.image_load("thing/wallsign", "data/images/things/wallsign.png");
    assets.image_load("thing/fakewall", "data/images/things/fakewall.png");
    assets.image_load("thing/spellbook", "data/images/things/spellbook.png");
}

// Little hack to ensure that timer doesn't fall too far behind in case of
// loss-of-focus

setInterval(() => {
    let now = Date.now();
    if(now - time_last >= 30) { 
        time_last = Date.now();
    }
}, 30);

// Start doing things
main();