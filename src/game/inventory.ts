// Inventory

import * as input from "../input";
import * as util from "../util";
import * as gamestate from "./gamestate";
import * as items from "./items";

let inventory = [];
let cursor_pos = 0;
let page_offset = 0;

export function update(delta: number) {
    if(input.key_pressed(input.KEY.ESCAPE)) {
        gamestate.set_state(gamestate.STATES.DEBUG);
    }
    if(input.key_pressed(input.KEY.DOWN)) {
        cursor_pos++;
        if(cursor_pos >= inventory.length) { cursor_pos = 0; }
    }
    if(input.key_pressed(input.KEY.UP)) {
        cursor_pos--;
        if(cursor_pos < 0) { 
            cursor_pos = inventory.length > 0 ? inventory.length-1 : 0; 
        }
    }
    if(input.key_pressed(input.KEY.ENTER)) {
        if(inventory[cursor_pos]) {
            let res = items.use(inventory[cursor_pos]);
            sweep(); 
            if(res) {
                cursor_pos = 0;
                gamestate.set_state(gamestate.STATES.DEBUG);
            }
        }
    }
}

export function add(item: any) {
    for(let i = 0; i < inventory.length; i++) {
        if(inventory[i].name === item.name) {
            inventory[i].quantity+=item.quantity;
            return;
        }
    }
    inventory.push(item);
}

export function get(item_name: string) {
    for(let i = 0; i < inventory.length; i++) {
        if(inventory[i].name === item_name) {
            return inventory[i];
        }
    }
    return null;
}

export function sweep() {
    for(let i = 0; i < inventory.length; i++) {
        if(inventory[i].quantity <= 0) { 
            inventory.splice(i,1);
        }
    }
}

export function render() {
    util.draw_clear("black");
    util.draw_border(0,0,40,30,"ui/border",true);
    util.draw_text(8,8,"INVENTORY");

    for(let i = 0; i < inventory.length; i++) {
        if(inventory[i]) {
            if(cursor_pos === i) {
                util.draw_text_inverted(24,24+(i*8), (!inventory[i].quantity || inventory[i].quantity === 1) ? inventory[i].name : inventory[i].name + ` (${inventory[i].quantity})`,"slategray");
                util.set_font("font/main");
            } else {
                util.draw_text(24,24+(i*8), (!inventory[i].quantity || inventory[i].quantity === 1) ? inventory[i].name : inventory[i].name + ` (${inventory[i].quantity})`);
            }
        }
    }
}

export function bind() {
    gamestate.bind_state(gamestate.STATES.INVENTORY, update, render);
}