// Win screen

import * as util from '../util';
import * as gamestate from './gamestate';
import * as input from '../input';

export function update(delta: number) {

}

export function render() {
    util.set_font("fnt/main");
    util.draw_border(72,8,22,6,"ui/border",true);
    util.draw_text_centered(16,"CONGRATULATIONS");
    util.draw_text_centered(24,"---");
    util.draw_text_centered(32, "You finished the game!");
    util.draw_text_centered(40, "Thank you for playing!");   
}

export function bind() {
    gamestate.bind_state(gamestate.STATES.WIN, update, render);
}