// Audio utils

import * as assets from './assets.ts';

export function play_sound(alias : string, volume?: number) {
    let sound = assets.sound_get(alias);
    if(sound.is_ready) {
        if(volume !== undefined) {
            sound.volume = volume;
        } else {
            sound.volume = 1.0;
        }
        if(sound.paused === false) {
            sound.pause();
            sound.currentTime = 0;
        }
        sound.play();
    }
}

export function play_music(alias : string) {
    let sound = assets.sound_get(alias);
    if(sound.is_ready) {
        sound.loop = true;
        sound.play();
    }
}

export function stop_sound(alias : string) {
    let sound = assets.sound_get(alias);
    if(sound.is_ready && sound.paused === false) {
        sound.pause();
        sound.currentTime = 0;
    }
}
