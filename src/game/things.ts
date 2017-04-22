// "Things" that sit in the world and serve some purpose or other

import * as util from "../util";
import * as inventory from "./inventory";
import * as items from "./items";
import * as player from "./player";
import * as map from "./map";
import * as messagelog from "./messagelog";
import * as message from "./message";
import * as gamestate from "./gamestate";

export enum THING {
    DUMMY = 0,
    SIGNPOST,
    PICKUP
}

export let thingtypes = {
    "signpost": {
        type: THING.SIGNPOST,
        name: "signpost",
        message: [
            "This is a signpost!",
            "Signposts may contain important information!"
        ],
        sprite: "thing/signpost",
        solid: true,
        candestroy: true,
        x: 0, y: 0
    }
};

let things = [];

export function update(delta: number) {
    for(let i = 0; i < things.length; i++) {
        if(things[i].solid === true) {
            map.occupy(things[i].x, things[i].y);
        }
    }
}

export function render() {
    for(let i = 0; i < things.length; i++) {
        if(map.is_visible(things[i].x, things[i].y)) {
            util.draw_sprite(things[i].sprite, things[i].x*16, things[i].y*16);
        }
    }
}

export function spawn(type: any, x: number, y: number) {
    let instance = null;
    if(type !== undefined) {
        instance = util.clone_object(type);
        instance.x = x;
        instance.y = y;
        things.push(instance);
    }
}

export function is_thing(x: number, y: number) {
    for(let i = 0; i < things.length; i++) {
        if(things[i].x === x && things[i].y === y) { return true; }
    }
}

export function look(x: number, y: number) {
    for(let i = 0; i < things.length; i++) {
        if(things[i].x === x && things[i].y === y) {
            if(things[i].type === THING.SIGNPOST) {
                message.clear();
                for(let j = 0; j < things[i].message.length; j++) {
                    message.push(things[i].message[j]);
                }
                gamestate.set_state(gamestate.STATES.MESSAGE);
            } else {
                messagelog.push(`You see a ${things[i].name}.`);
            }
        }
    }
}

export function attack(x: number, y: number) {
    for(let i = 0; i < things.length; i++) {
        if(things[i].x === x && things[i].y === y) {
            if(things[i].candestroy) {
                messagelog.push(`You smash the ${things[i].name}, breaking it into pieces!`);
                things.splice(i,1);
            } else {
                messagelog.push(`You hit the ${things[i].name}, accomplishing nothing.`);
            }
        }
    }
}