// Enemy types

import * as assets from "../assets";
import * as util from "../util";
import * as maps from "./map";
import * as player from './player';
import * as messagelog from './messagelog';
import * as effects from './fx';
import * as gamestate from "./gamestate";

let enemies = [];

export let enemyTypes = {
    "SNAKE": {
        sprite: "enemy/snake",
        name: "Snake",
        detail: "Red Snake",
        maxhp: 2,
        hp: 2,
        gold: 1,
        atk: 1,
        x: 0,
        y: 0,
        range: 1
    },
    "SLIME": {
        sprite: "enemy/slime",
        name: "Slime",
        detail: "Slime",
        maxhp: 4,
        hp: 4,
        gold: 2,
        atk: 1,
        x: 0,
        y: 0,
        range: 1
    },
    "RAT": {
        sprite: "enemy/rat",
        name: "Rat",
        detail: "Mangy Rat",
        maxhp: 1,
        hp: 1,
        gold: 2,
        atk: 2,
        x: 0,
        y: 0,
        range: 1
    },
    "BAT": {
        sprite: "enemy/bat",
        name: "Giant Bat",
        detail: "Giant Bat",
        maxhp: 5,
        hp: 5,
        gold: 3,
        atk: 1,
        x: 0,
        y: 0,
        range: 1
    },
    "ZOMBIE": {
        sprite: "enemy/zombie",
        name: "Zombie",
        detail: "Zombie",
        maxhp: 8,
        hp: 8,
        gold: 5,
        atk: 2,
        x: 0,
        y: 0,
        range: 1
    },
    "SKELETON": {
        sprite: "enemy/skeleton",
        name: "Skeleton",
        detail: "Skeleton",
        maxhp: 4,
        hp: 4,
        gold: 4,
        atk: 4,
        x: 0,
        y: 0,
        range: 1
    },
    "GOBLIN": {
        sprite: "enemy/goblin",
        name: "Goblin",
        detail: "Goblin",
        maxhp: 9,
        hp: 9,
        gold: 7,
        atk: 5,
        x: 0,
        y: 0,
        range: 1
    },
    "DRAGON": {
        sprite: "enemy/dragon",
        name: "Dragon",
        detail: "Dragon",
        maxhp: 30,
        hp: 30,
        gold: 20,
        atk: 3,
        x: 0,
        y: 0,
        range: 1
    },
};

function move_left(enemy: any) {
    if(!maps.is_occupied(enemy.x-1, enemy.y) && maps.is_passable(enemy.x-1, enemy.y)) { enemy.x -= 1; }
}

function move_right(enemy: any) {
    if(!maps.is_occupied(enemy.x+1, enemy.y) && maps.is_passable(enemy.x+1, enemy.y)) { enemy.x += 1; }
}

function move_up(enemy: any) {
    if(!maps.is_occupied(enemy.x, enemy.y-1) && maps.is_passable(enemy.x, enemy.y-1)) { enemy.y -= 1; }
}

function move_down(enemy: any) {
    if(!maps.is_occupied(enemy.x, enemy.y+1) && maps.is_passable(enemy.x, enemy.y+1)) { enemy.y += 1; }
}

function move_dx(enemy: any, dx: number, dy: number) {
    let r = Math.random() > 0.5;
    if(r) {
        if(dx > 0) { move_right(enemy); }
        else if(dx < 0) { move_left(enemy); } 
        else if(dy > 0) { move_down(enemy); }
        else if(dy < 0) { move_up(enemy); }
    } else {
        if(dy > 0) { move_down(enemy); }
        else if(dy < 0) { move_up(enemy); }
        else if(dx > 0) { move_right(enemy); }
        else if(dx < 0) { move_left(enemy); }
    }
    maps.occupy(enemy.x, enemy.y);
}

function move_toward_player(enemy: any) {
    let dx = 0;
    let dy = 0;
    if(player.getpos().x + maps.get_offset().x > enemy.x) { dx = 1;} else
    if(player.getpos().x + maps.get_offset().x < enemy.x) { dx = -1;}
    if(player.getpos().y + maps.get_offset().y > enemy.y) { dy = 1;} else
    if(player.getpos().y + maps.get_offset().y < enemy.y) { dy = -1;}

    if(!maps.is_occupied(enemy.x+dx, enemy.y+dy) && maps.is_passable(enemy.x+dx, enemy.y+dy)) {
        move_dx(enemy, dx, dy);    
    } else
    if(!maps.is_occupied(enemy.x+dx, enemy.y) && maps.is_passable(enemy.x+dx, enemy.y)) {
        move_dx(enemy, dx, 0);
    } else
    if(!maps.is_occupied(enemy.x, enemy.y+dy) && maps.is_passable(enemy.x, enemy.y+dy)) {
        move_dx(enemy, 0, dy);
    } else {
        
    }
}

export function damage(enemy: any, amount: number) {
    enemy.hp -= amount;
}

export function death(enemy: any) {
    let xp = util.roll(1, enemy.maxhp);
    messagelog.push(`The ${enemy.name} was vanquished! Received ${xp}xp`);
    player.give_gold(xp);
    effects.hit((enemy.x-maps.get_offset().x)*16, (enemy.y-maps.get_offset().y)*16);
    effects.blinksprite((enemy.x-maps.get_offset().x)*16, (enemy.y-maps.get_offset().y)*16, enemy.sprite);
    if(enemy.name === "Dragon") {
        gamestate.set_state(gamestate.STATES.WIN);
    }
}

export function get_at_position(x: number, y: number) {
    for(let i = 0; i < enemies.length; i++) {
        if(enemies[i].x === x && enemies[i].y === y) { 
            return enemies[i]; 
        }
    }
    return null;
}

export function update_occupy() {
    for(let i = 0; i < enemies.length; i++) {
        maps.occupy(enemies[i].x, enemies[i].y);
    }
}

export function render() {
    let m = maps.get_offset();
    for(let i = 0; i < enemies.length; i++) {
        if(maps.is_visible(enemies[i].x, enemies[i].y)) {
            util.draw_sprite(enemies[i].sprite, (enemies[i].x-m.x)*16, (enemies[i].y-m.y)*16);
        }
    }
}

export function update(delta: number) {
    for(let i = 0; i < enemies.length; i++) {
        if(maps.is_visible(enemies[i].x, enemies[i].y)) {
            maps.occupy(enemies[i].x, enemies[i].y);
            let e = enemies[i];
            if(e.hp <= 0) {
                death(enemies[i]);
                enemies.splice(i,1);
            } else {
                let edx = Math.abs((e.x) - (player.getpos().x+maps.get_offset().x));
                let edy = Math.abs((e.y) - (player.getpos().y+maps.get_offset().y));
                if(edx <= e.range && edy <= e.range) {
                    messagelog.push(`The ${e.name} attacks you!`);
                    player.hurt(e.atk);
                } else { 
                    move_toward_player(enemies[i]);
                }
            }
        }
    }
}

export function load() {
    assets.image_load("enemy/snake", "data/images/chars/snake.png");
    assets.image_load("enemy/slime", "data/images/chars/slime.png");
    assets.image_load("enemy/rat", "data/images/chars/rat.png");
    assets.image_load("enemy/zombie", "data/images/chars/zombie.png");
    assets.image_load("enemy/bat", "data/images/chars/bat.png");
    assets.image_load("enemy/skeleton", "data/images/chars/skeleton.png");
    assets.image_load("enemy/goblin", "data/images/chars/goblin.png");
    assets.image_load("enemy/dragon", "data/images/chars/dragon.png");
}

export function clear_spawns() {
    enemies = [];
}

export function spawn(type: any, x: number, y: number) {
    let instance = null;
    if(type !== undefined) {
        instance = util.clone_object(type);
        instance.x = x;
        instance.y = y;
        enemies.push(instance);
    }
}

