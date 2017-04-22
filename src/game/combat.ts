// Combat handlers

export function attack(attacker : any, target : any) {
    target.hp -= attacker.str;
}