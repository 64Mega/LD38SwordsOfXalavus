// Gameover screen

import * as util from '../util';
import * as gamestate from './gamestate';
import * as input from '../input';

export function update(delta: number) {

}

export function render() {
    util.set_font("fnt/main");
    util.draw_border(72,8,22,6,"ui/border",true);
    util.draw_text_centered(16,"GAME OVER");
    util.draw_text_centered(24,"---");
    util.draw_text_centered(32, "If you want to try again, please");
    util.draw_text_centered(40, "reload the page.");   
}

export function bind() {
    gamestate.bind_state(gamestate.STATES.GAMEOVER, update, render);
}