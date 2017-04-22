// Enemy types

import * as assets from "../assets";
import * as util from "../util";
import * as maps from "./map";
import * as player from './player';
import * as messagelog from './messagelog';
import * as effects from './fx';

let enemies = [];

export let enemyTypes = {
    "SNAKE": {
        sprite: "enemy/snake",
        name: "Snake",
        detail: "Red Snake",
        hp: 2,
        gold: 1,
        atk: 1,
        x: 0,
        y: 0,
        range: 1
    }
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
    messagelog.push(`The ${enemy.name} was vanquished! Received ${enemy.gold} gold!`);
    player.give_gold(enemy.gold);
    effects.hit((enemy.x-maps.get_offset().x)*16, (enemy.y-maps.get_offset().y)*16);
    effects.blinksprite((enemy.x-maps.get_offset().x)*16, (enemy.y-maps.get_offset().y)*16, enemy.sprite);
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

