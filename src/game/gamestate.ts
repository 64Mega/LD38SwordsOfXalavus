// Simple representation of game states

let states = {};
let current_state = null;

export enum STATES {
    DEBUG = 0,
    WORLD,
    FIELD,
    BATTLE,
    CONVERSATION,
    SHOP,
    INVENTORY,
    STATS,
    MAGIC,
    GAMEOVER,
    TITLE
};

export function bind_state(state : STATES, update : any, render : any) {
    let new_state = {};
    new_state["update"] = update;
    new_state["render"] = render;
    states[state] = new_state;
}

export function get_current_state() {
    return current_state;    
}

export function set_state(state: STATES) {
    current_state = states[state];
}