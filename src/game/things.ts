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
    PICKUP,
    WARP
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
    },
    "warp": {
        type: THING.WARP,
        name: "doorway",
        sprite: "",
        solid: false,
        x: 0, y: 0,
        target_x: 0, target_y: 0, target_map: ""
    },
    "shortsword": {
        type: THING.PICKUP,
        name: "short sword",
        sprite: "thing/chest",
        solid: true,
        x: 0, y: 0,
        gives: items.itemtypes.shortsword
    },
    "heavy_stick": {
        type: THING.PICKUP,
        name: "heavy stick",
        sprite: "thing/chest",
        solid: true,
        x: 0, y: 0,
        gives: items.itemtypes.heavy_stick
    },
    "claymore": {
        type: THING.PICKUP,
        name: "claymore",
        sprite: "thing/chest",
        solid: true,
        x: 0, y: 0,
        gives: items.itemtypes.longsword
    },
    "spear": {
        type: THING.PICKUP,
        name: "spear",
        sprite: "thing/chest",
        solid: true,
        x: 0, y: 0,
        gives: items.itemtypes.spear
    },
    "shortbow": {
        type: THING.PICKUP,
        name: "shortbow",
        sprite: "thing/chest",
        solid: true,
        x: 0, y: 0,
        gives: items.itemtypes.shortbow
    },
    "arrow_x15": {
        type: THING.PICKUP,
        name: "bundle of arrows",
        sprite: "thing/chest",
        solid: true,
        quantity: 15,
        x: 0, y: 0,
        gives: items.itemtypes.arrow
    },
    "beater": {
        type: THING.PICKUP,
        name: "beater",
        sprite: "thing/pickup_default",
        solid: true,
        x: 0, y: 0,
        gives: items.itemtypes.seagull_beater
    },
    "leather_armor": {
        type: THING.PICKUP,
        name: "leather armor",
        sprite: "thing/chest",
        solid: true,
        x: 0, y: 0,
        gives: items.itemtypes.leather_armor
    },
    "healing_herbs_x3": {
        type: THING.PICKUP,
        name: "small bag of healing herbs",
        sprite: "thing/pickup_default",
        solid: true,
        x: 0, y: 0,
        gives: items.itemtypes.healing_herb_x3,
        quantity: 3
    },
    "bed": {
        // Should make this heal the player on use
        type: THING.DUMMY,
        name: "bed",
        sprite: "thing/bed",
        solid: true,
        x: 0, y: 0
    },
    "cupboard": {
        // Will eventually be a container object
        // Should make the Inventory screen a reusable class for that purpose,
        // can be used for shops too.
        type: THING.DUMMY,
        name: "cupboard",
        sprite: "thing/cupboard",
        solid: true,
        x: 0, y: 0
    },
    "bookshelf": {
        type: THING.SIGNPOST,
        name: "bookshelf",
        sprite: "thing/bookshelf",
        solid: true,
        message: [
            "A dusty collection of books.",
            "You spend a few minutes leafing through",
            "the pages of some old tomes."
        ],
        x: 0, y: 0
    },
    "fakewall": {
        type: THING.DUMMY,
        name: "cracked wall",
        sprite: "thing/fakewall",
        solid: true,
        candestroy: true,
        x: 0, y: 0
    },
    // Spell pickups
    "spell_magic_arrow": {
        type: THING.PICKUP,
        name: "spell: magic arrow",
        sprite: "thing/spellbook",
        solid: true,
        candestroy: false,
        x: 0, y: 0,
        gives: items.itemtypes.spell_magic_arrow,
        quantity: 1
    },
    "spell_light_heal": {
        type: THING.PICKUP,
        name: "spell: light heal",
        sprite: "thing/spellbook",
        solid: true,
        candestroy: false,
        x: 0, y: 0,
        gives: items.itemtypes.spell_light_heal,
        quantity: 1
    },
    "spell_fireball": {
        type: THING.PICKUP,
        name: "spell: fireball",
        sprite: "thing/spellbook",
        solid: true,
        candestroy: false,
        x: 0, y: 0,
        gives: items.itemtypes.spell_fireball,
        quantity: 1
    },
    "spell_lightning_stake": {
        type: THING.PICKUP,
        name: "spell: lightning stake",
        sprite: "thing/spellbook",
        solid: true,
        candestroy: false,
        x: 0, y: 0,
        gives: items.itemtypes.spell_lightning_stake,
        quantity: 1
    }
};

let things = [];

export function update(delta: number) {
    for(let i = 0; i < things.length; i++) {
        if(things[i].solid === true) {
            map.occupy(things[i].x, things[i].y);
        }
        if(things[i].type === THING.WARP) {
            if(things[i].x === player.getpos().x + map.get_offset().x &&
                things[i].y === player.getpos().y + map.get_offset().y) {
                    console.dir(things[i]);
                    map.warpto(things[i].target_map, {x: things[i].target_x, y: things[i].target_y});
                }
        }
    }
}

export function render() {
    for(let i = 0; i < things.length; i++) {
        if(map.is_visible(things[i].x, things[i].y)) {
            util.draw_sprite(things[i].sprite, (things[i].x*16)-(map.get_offset().x*16), (things[i].y*16)-(map.get_offset().y*16));
        }
    }
}

export function clear() {
    things = [];
}

export function spawn(type: any, x: number, y: number, onremove?: any) {
    let instance = null;
    if(type !== undefined) {
        instance = util.clone_object(type);
        instance.x = x;
        instance.y = y;

        if(onremove !== undefined) {
            instance.onremove = onremove;
        }

        if(type.quantity !== undefined) {
            instance.quantity = type.quantity;
        }

        things.push(instance);
    }
}

export function is_thing(x: number, y: number) {
    for(let i = 0; i < things.length; i++) {
        if(things[i].x === x && things[i].y === y) { return true; }
    }
}

export function get(x: number, y: number) {
    for(let i = 0; i < things.length; i++) {
        if(things[i].x === x && things[i].y === y) {
            if(things[i].type === THING.PICKUP) {
                inventory.add(things[i].gives);
                messagelog.push(`Picked up ${things[i].name}`);
                if(things[i].onremove) {
                    things[i].onremove();
                }
                things.splice(i,1);
                return;
            }
        }
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
                if(things[i].onremove) {
                    things[i].onremove();
                }
                things.splice(i,1);
            } else {
                messagelog.push(`You hit the ${things[i].name}, accomplishing nothing.`);
            }
        }
    }
}