// Game Items
import * as util from "../util";
import * as player from "./player";
import * as messagelog from "./messagelog";
import * as message from "./message";
import * as gamestate from "./gamestate";

enum ITEMACTIONS {
    HEAL = 0,
    WEAPON,
    ARMOR,
    AMMUNITION,
    SPELL,
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
    "healing_herb_x3": {
        action: ITEMACTIONS.HEAL,
        name: "Healing Herb",
        price: 2,
        power: 5,
        quantity: 3
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
    "heavy_stick": {
        action: ITEMACTIONS.WEAPON,
        name: "Heavy Stick",
        price: 0,
        minatk: 2,
        maxatk: 3,
        range: 1,
        quantity: 1,
        consume: false,
        str: 1, dex: 0, mag: 0
    },
    "shortsword": {
        action: ITEMACTIONS.WEAPON,
        name: "Iron Shortsword",
        price: 5,
        maxatk: 6,
        minatk: 2,
        range: 1,
        quantity: 1,
        consume: false,
        str: 2, dex: 0, mag: 0
    },
    "longsword": {
        action: ITEMACTIONS.WEAPON,
        name: "Steel Claymore",
        price: 5,
        maxatk: 11,
        minatk: 3,
        range: 1,
        quantity: 1,
        consume: false,
        str: 4, dex: 0, mag: 0
    },
    "spear": {
        action: ITEMACTIONS.WEAPON,
        name: "Spear",
        price: 5,
        maxatk: 8,
        minatk: 2,
        range: 2,
        quantity: 1,
        consume: false,
        str: 2, dex: 3, mag: 0
    },
    "seagull_beater": {
        action: ITEMACTIONS.WEAPON,
        name: "Beater",
        price: 0,
        maxatk: 50,
        minatk: 5,
        range: 2,
        quantity: 1,
        consume: false,
        str: 1, dex: 1, mag: 1
    },
    "shortbow": {
        action: ITEMACTIONS.WEAPON,
        name: "Shortbow",
        price: 8,
        minatk: 1,
        maxatk: 2,
        range: 4,
        ammotype: "arrow",
        quantity: 1,
        consume: false,
        str: 1, dex: 1, mag: 0
    },
    "arrow": {
        action: ITEMACTIONS.AMMUNITION,
        name: "Arrow",
        price: 1,
        quantity: 15
    },
    "leather_armor": {
        action: ITEMACTIONS.ARMOR,
        name: "Leather Armor",
        price: 10,
        def: 1,
        quantity: 1,
        consume: false,
        str: 2, dex: 1, mag: 1
    },
    "chainmail_armor": {
        action: ITEMACTIONS.ARMOR,
        name: "Chainmail Armor",
        price: 10,
        def: 2,
        quantity: 1,
        consume: false,
        str: 4, dex: 1, mag: 1
    },
    "plate_armor": {
        action: ITEMACTIONS.ARMOR,
        name: "Plate Armor",
        price: 10,
        def: 5,
        quantity: 1,
        consume: false,
        str: 8, dex: 3, mag: 1
    },
    // Spells
    "spell_magic_arrow":{
        action: ITEMACTIONS.SPELL,
        name: "Magic Arrow",
        price:0,
        minatk: 1,
        maxatk: 7,
        range: 8,
        cost: 5,
        str:0, dex:0, mag: 2
    },
    "spell_light_heal":{
        action: ITEMACTIONS.SPELL,
        name: "Light Heal",
        price:0,
        minatk: -5,
        maxatk: -50,
        range: 1,
        cost: 5,
        str:0, dex:0, mag: 2
    },
    "spell_fireball":{
        action: ITEMACTIONS.SPELL,
        name: "Fireball",
        price:0,
        minatk: 3,
        maxatk: 10,
        range: 5,
        cost: 7,
        str:0, dex:0, mag: 4
    },
    "spell_lightning_stake":{
        action: ITEMACTIONS.SPELL,
        name: "Lightning Stake",
        price:0,
        minatk: 5,
        maxatk: 15,
        range: 4,
        cost: 10,
        str:0, dex:0, mag: 5
    }
};

export function create(itemtype: any) {
    return util.clone_object(itemtype);
}

export function use(itemtype: any) {
    switch(itemtype.action) {
        case ITEMACTIONS.WEAPON: {
            if(player.stats.str < itemtype.str) {
                messagelog.push(`You have insufficient strength to wield that!`);
                messagelog.push(`Need STR:${itemtype.str}, DEX:${itemtype.dex}, MAG:${itemtype.mag}`);
                return true;
            } else if(player.stats.dex < itemtype.dex) {
                messagelog.push(`You lack the dexterity required to wield that!`);
                messagelog.push(`Need STR:${itemtype.str}, DEX:${itemtype.dex}, MAG:${itemtype.mag}`);
                return true;
            } else if(player.stats.mag < itemtype.mag) {
                messagelog.push(`You lack the magic skill required to understand that!`);
                messagelog.push(`Need STR:${itemtype.str}, DEX:${itemtype.dex}, MAG:${itemtype.mag}`);
                return true;
            } else {
                messagelog.push(`Equipped the ${itemtype.name}`);
                player.equip_weapon(itemtype);
                return true;
            }
        };
        case ITEMACTIONS.SPELL: {
            if(player.stats.mag < itemtype.mag) {
                messagelog.push(`You lack the magic skill required to use that!`);
                messagelog.push(`Need MAG:${itemtype.mag}`);
                return true;
            } else {
                messagelog.push(`Readied ${itemtype.name}`);
                player.equip_spell(itemtype);
                return true;
            }
        };
        case ITEMACTIONS.ARMOR: {
            if(player.stats.str < itemtype.str) {
                messagelog.push(`You have insufficient strength to wear that!`);
                messagelog.push(`Need STR:${itemtype.str}, DEX:${itemtype.dex}, MAG:${itemtype.mag}`);
                return true;
            } else if(player.stats.dex < itemtype.dex) {
                messagelog.push(`You lack the dexterity required to wear that!`);
                messagelog.push(`Need STR:${itemtype.str}, DEX:${itemtype.dex}, MAG:${itemtype.mag}`);
                return true;
            } else if(player.stats.mag < itemtype.mag) {
                messagelog.push(`You lack the magic understanding required to wear that!`);
                messagelog.push(`Need STR:${itemtype.str}, DEX:${itemtype.dex}, MAG:${itemtype.mag}`);
                return true;
            } else {
                messagelog.push(`Equipped the ${itemtype.name}`);
                player.equip_armor(itemtype);
                return true;
            }
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
