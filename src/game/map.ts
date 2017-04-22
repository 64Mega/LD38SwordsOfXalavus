// Representation of a game-map
import * as assets from '../assets';
import * as util from '../util';
import * as player from './player';

let maps = {};
let current_map = null;
let offset_x = 0;
let offset_y = 0;
let occupied = {};

enum TILETYPES {
    VOID = 0,
    GRASS
};

function new_map(name: string, width: number, height: number, meta: any, data: any) {
    let m = {
        "width": width,
        "height": height,
        "meta": meta,
        "data": data
    };

    maps[name] = m;
}

export function get_offset() {
    return {
        x: offset_x,
        y: offset_y
    };
}

export function set_offset(x: number, y: number) {
    offset_x = x;
    offset_y = y;
}

function T(type : string) {
    switch(type) {
        case '.': return TILETYPES.GRASS;
        default : return TILETYPES.VOID;
    }
}

export function is_passable(x: number, y: number) {
    if(x < 0 || y < 0 || x > current_map.width - 1 || y > current_map.height - 1) { return false; }
    switch(current_map.data[y * current_map.width + x]) {
        case 0:
        case 1:
        case 2:
        case 3:
        case 4:
        case 5: return true;
        default: return false;
    }
}

export function reset_occupied() {
    occupied = {};
}

export function occupy(x: number, y: number) {
    let idex = `${x}::${y}`;
    occupied[idex] = true;
}

export function is_occupied(x: number, y: number) {
    let idex = `${x}::${y}`;
    return occupied[idex] === true;
}

export function is_visible(x: number, y: number) {
    return !(x < offset_x || x >= offset_x + 12 || y < offset_y || y >= offset_y +12);
}

export function switch_map(id : string) {
    current_map = maps[id];
    if(current_map && current_map.meta.player) {
        player.setpos(current_map.meta.player.x, current_map.meta.player.y);
    }
}

export function render() {
    let m = current_map;
    let c = util.context;
    let tileset = assets.image_get("tiles/main");
    if(!tileset && !tileset.is_ready) { return; }
    if(m === undefined) { return; }
    for(let iy = offset_y; iy < offset_y+12; iy++) {
        if(iy < 0) { continue; }
        if(iy >= m.height) { continue; }
        for(let ix = offset_x; ix < offset_x+12; ix++) {
            if(ix < 0) { continue; }
            if(ix >= m.width) { continue; }
            let t = m.data[iy * m.width + ix] - 1;
            c.drawImage(tileset, t*16,0,16,16, (ix-offset_x)*16, (iy-offset_y)*16, 16, 16);
        }
    }
}

function diagonal_distance(x1: number, y1: number, x2: number, y2: number) {
    return Math.max(Math.abs(x1 - x2), Math.abs(y1 - y2));
}

// Test Map Data (Use Tiled later)

export function init() {
    assets.image_load("tiles/main", "data/images/tiles/tiles.png");

    new_map("debug", 24, 24, {
        name: "Debug",
        player: {
            x: 6, y: 6
        }
    }, [6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 6, 6, 6, 6, 6, 6, 6, 6, 2, 2, 2, 2, 2, 2, 2, 5, 5, 5, 2, 2, 2, 2, 2, 2, 2, 6, 6, 1, 6, 6, 6, 2, 2, 2, 2, 2, 2, 4, 4, 5, 5, 5, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 6, 6, 2, 2, 2, 3, 2, 4, 4, 4, 4, 5, 5, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 6, 6, 2, 2, 2, 2, 2, 4, 4, 2, 2, 5, 5, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 6, 6, 2, 2, 2, 2, 4, 4, 3, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 6, 6, 2, 2, 2, 2, 4, 4, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 6, 6, 2, 2, 2, 2, 4, 4, 3, 2, 2, 2, 2, 2, 2, 6, 6, 6, 6, 6, 2, 2, 2, 2, 6, 6, 2, 2, 3, 2, 4, 4, 2, 2, 2, 2, 2, 6, 6, 6, 6, 6, 6, 6, 6, 2, 2, 2, 6, 6, 2, 2, 2, 2, 4, 4, 2, 2, 2, 2, 6, 6, 6, 6, 6, 6, 6, 6, 6, 2, 2, 2, 6, 6, 6, 2, 2, 2, 4, 4, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 2, 2, 2, 6, 6, 6, 2, 2, 2, 2, 2, 6, 6, 6, 6, 6, 6, 6, 6, 6, 2, 2, 2, 2, 2, 2, 2, 6, 6, 6, 2, 2, 2, 2, 2, 2, 6, 6, 6, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 6, 6, 6, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 6, 6, 6, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 6, 6, 2, 2, 2, 2, 2, 2, 2, 6, 6, 6, 6, 2, 2, 2, 2, 2, 2, 2, 2, 2, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 1, 1, 6, 6, 6, 6, 2, 2, 2, 2, 2, 6, 6, 6, 6, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 6, 6, 6, 6, 6, 6, 6, 6, 6, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 6, 6, 6, 6, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]);
}