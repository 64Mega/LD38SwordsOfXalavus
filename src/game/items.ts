// Game Items
import * as util from "../util";
import * as player from "./player";
import * as messagelog from "./messagelog";
enum ITEMACTIONS {
    HEAL = 0,
    WEAPON,
    ARMOR,
    AMMUNITION,
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
        quantity: 1,
        consume: false
    },
    "shortsword": {
        action: ITEMACTIONS.WEAPON,
        name: "Iron Shortsword",
        price: 5,
        atk: 3,
        range: 1,
        quantity: 1,
        consume: false
    },
    "shortbow": {
        action: ITEMACTIONS.WEAPON,
        name: "Shortbow",
        price: 8,
        atk: 1,
        range: 4,
        ammotype: "arrow",
        quantity: 1,
        consume: false
    },
    "arrow": {
        action: ITEMACTIONS.AMMUNITION,
        name: "Arrow",
        price: 1,
        quantity: 1
    },
    "leather_armor": {
        action: ITEMACTIONS.ARMOR,
        name: "Leather Armor",
        price: 10,
        def: 1,
        quantity: 1,
        consume: false
    }
};

export function create(itemtype: any) {
    return util.clone_object(itemtype);
}

export function use(itemtype: any) {
    switch(itemtype.action) {
        case ITEMACTIONS.WEAPON: {
            messagelog.push(`Equipped the ${itemtype.name}`);
            player.equip_weapon(itemtype);
            return true;
        };
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
