// Game Items
import * as util from "../util";
import * as player from "./player";
import * as messagelog from "./messagelog";
enum ITEMACTIONS {
    HEAL = 0,
    NONE
};

export let itemtypes = {
    "healing_herb": {
        action: ITEMACTIONS.HEAL,
        name: "Healing Herb",
        price: 2,
        power: 5,
        quantity: 1
    },
    "healing_potion": {
        action: ITEMACTIONS.HEAL,
        name: "Healing Potion",
        price: 40,
        power: 30,
        quantity: 1,
    },
    "useless_mcguffin": {
        action: ITEMACTIONS.NONE,
        name: "Useless McGuffin",
        price: 0,
        msg: "You use the Useless McGuffin, but nothing happens!",
        quantity: 1
    }
};

export function create(itemtype: any) {
    return util.clone_object(itemtype);
}

export function use(itemtype: any) {
    switch(itemtype.action) {
        case ITEMACTIONS.HEAL: {
            messagelog.push(`Used the ${itemtype.name}`);
            player.heal(itemtype.power);
            if(itemtype.consume !== false) {
                itemtype.quantity -= 1;
            }
            return true;
        };
        case ITEMACTIONS.NONE: {
            if(itemtype.msg) {
                messagelog.push(itemtype.msg);
            }
            if(itemtype.consume !== false) {
                itemtype.quantity -= 1;
            }
            return true;
        };
    }
}
