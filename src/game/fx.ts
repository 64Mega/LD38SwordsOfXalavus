// Visual effects

import * as util from "../util";

let effects = [];

enum EFFECT {
    HIT,
    BLINKSPRITE
};

export function hit(x: number, y: number) {
    let e = {
        type: EFFECT.HIT, "x": x, "y": y, lifetime: 8, sprite: "fx/hit"
    }
    effects.push(e);
}

export function blinksprite(x: number, y: number, spr: string) {
    let e = {
        type: EFFECT.BLINKSPRITE, "x": x, "y": y, lifetime: 10, sprite: spr
    };

    effects.push(e);
}

export function update(delta: number) {
    for(let i = 0; i < effects.length; i++) {
        if(effects[i].lifetime <= 0) { effects.splice(i,1); } else {
            effects[i].lifetime -= 1 * delta;
        }
    }
}

export function render() {
    for(let i = 0; i < effects.length; i++) {
        let e = effects[i];
        if(e.type === EFFECT.HIT) {
            util.draw_sprite(e.sprite, e.x, e.y);
        }
        if(e.type === EFFECT.BLINKSPRITE) {
            if(e.lifetime % 2 === 0) {
                util.draw_sprite(e.sprite, e.x, e.y);
            }
        }
    }
}