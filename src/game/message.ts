// Display a windowed message

import * as gamestate from "./gamestate";
import * as util from "../util";
import * as input from "../input";

let message = [];

export function clear() {
    message = [];
}

export function push(msg: string) {
    message.push(msg);
}

export function update(delta: number) {
    if(input.key_pressed(input.KEY.ENTER)) {
        gamestate.revert_state();
    }
}

export function render() {
    let cw = 0;
    for(let i = 0; i < message.length; i++) {
        if(message[i].length > cw) { cw = message[i].length; }
    }
    cw = (cw+3);
    let ch = (message.length) + 16;
    
    //util.draw_border((192/2)-(cw/2), (192/2)-(ch/2), cw, message.length+2, "ui/border", true);
    let sx = Math.floor((192/2)-(cw/2));
    let sy = Math.floor((192/2)-(ch/2));
    util.draw_fillrect(sx, sy, cw*5, (message.length+4)*8, "#0A0A0A");
    util.draw_boxed_text(sx, sy, "[MESSAGE]","#0A0A0A");
    util.draw_boxed_text(sx, sy+(message.length+3)*8, "Press ENTER to Close","#0A0A0A");

    for(let i = 0; i < message.length; i++) {
        util.draw_text(sx+8, sy+(i*8)+8, message[i]);
    }
}

export function bind() {
    gamestate.bind_state(gamestate.STATES.MESSAGE, update, render);
}