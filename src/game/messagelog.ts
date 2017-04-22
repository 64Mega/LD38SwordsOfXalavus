// Simple message system

import * as util from '../util';

let messages = ["","","",""];
let y_offset = 0;
let delay = 0;
const SCROLL_DELAY = 20;

export function push(str: string) {
    messages.push(str);
}

export function draw(x: number, y: number) {
    util.set_font("font/main");
    if(messages[4] && messages[4] !== "") {
        if(y_offset <= 8) { 
            y_offset += 0.5; 
            util.draw_text(x, y-y_offset, messages[0] ? messages[0] : "");
            util.draw_text(x, y-y_offset+8, messages[1] ? messages[1] : "");
            util.draw_text(x, y-y_offset+16, messages[2] ? messages[2] : "");
            util.draw_text(x, y-y_offset+24, messages[3] ? messages[3] : "");
            util.draw_text(x, y-y_offset+32, messages[4] ? messages[4] : "");
        } else {
            util.draw_text(x, y-y_offset, messages[0] ? messages[0] : "");
            util.draw_text(x, y-y_offset+8, messages[1] ? messages[1] : "");
            util.draw_text(x, y-y_offset+16, messages[2] ? messages[2] : "");
            util.draw_text(x, y-y_offset+24, messages[3] ? messages[3] : "");
            util.draw_text(x, y-y_offset+32, messages[4] ? messages[4] : "");
            if(delay < SCROLL_DELAY) { delay++; } else {
                messages.shift();
                delay = 0;
                y_offset = 0;
            }
        }
    }  else {
        util.draw_text(x, y, messages[0] ? messages[0] : "");
        util.draw_text(x, y+8, messages[1] ? messages[1] : "");
        util.draw_text(x, y+16, messages[2] ? messages[2] : "");
        util.draw_text(x, y+24, messages[3] ? messages[3] : "");
    }
    
}
