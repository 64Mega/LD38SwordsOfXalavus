// Utility functions/classes

import assets = require("./assets");

export let context = null;
export let canvas = null;
let context_width, context_height;

export function canvas_init(width: number, height: number) {
    // Sets canvas size to fill the page as best as possible
    // while maintaining integral scale and the desired resolution

    let win_width = window.innerWidth;
    let win_height = window.innerHeight;
    let scale_a = Math.floor((win_width / width));
    let scale_b = Math.floor((win_height / height));
    let scale = scale_a < scale_b ? scale_a : scale_b;
    if(scale < 1) { scale = 1; }
    let final_width = width * scale;
    let final_height = height * scale;

    canvas = document.createElement("canvas");

    if(canvas) {
        canvas.width = final_width;
        canvas.height = final_height;
        canvas.id = "gameCanvas";
        context = canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        context.scale(scale,scale);
        context.imageSmoothingEnabled = false;
        context.mozImageSmoothingEnabled = false;
        context.webkitImageSmoothingEnabled = false;
        context.msImageSmoothingEnabled = false;
        context_width = width;
        context_height = height;
        context.lineWidth = 1.0;
    }
}

let util_font_current = null;

export function set_font(font : string) {
   let img = assets.image_get(font); 
   if(img) {
       util_font_current = img;
   }
}

export function draw_text(x : number, y : number, str : string) {
    const char_offset = ' '.charCodeAt(0);
    if(!util_font_current) { return; }
    for(var i = 0; i < str.length; i++) {
        let char_code = str.charCodeAt(i) - char_offset;
        let sx = 5 * char_code;

        context.drawImage(util_font_current, sx, 0, 5, 8, x + i*5, y, 5, 8);
    }
}

export function draw_text_centered(y: number, str: string) {
    var cw = 160;
    var lw = Math.floor((str.length*5)/2);
    draw_text(cw-lw, y, str); 
    
}

export function draw_boxed_text(x: number, y: number, str: string, bgcolor: string) {
    var texwidth = str.length * 5;
    draw_fillrect(x,y,texwidth,8,bgcolor);
    set_font("font/main");
    draw_text(x,y,str);
}

export function draw_highlight_text(x: number, y: number, str: string, bgcolor: string) {
    draw_text_inverted(x,y,str[0],bgcolor);
    let rstr = str.split('').splice(1).join('');
    set_font("font/main");
    draw_text(x+5,y,rstr);
}

export function draw_text_inverted(x: number, y: number, str: string, bgcolor: string) {
    var texwidth = str.length * 5;
    draw_fillrect(x,y,texwidth,8,bgcolor);
    set_font("font/inverted");
    draw_text(x,y,str);
}

export function draw_clear(clear_color : string) {
    context.fillStyle = "#0A0A0A";
    context.fillRect(0,0,context_width,context_height);
}

export function set_color(color : string) {
    context.fillStyle = color;
    context.strokeStyle = color;
}

export function draw_fillrect(x : number, y : number, w : number, h : number, color : string) {
    context.fillStyle = color;
    context.fillRect(x,y,w,h);
}

export function draw_line(x1 : number, y1 : number, x2 : number, y2 : number, color : string) {
    context.strokeStyle = color;
    context.beginPath();
    context.moveTo(x1,y1);
    context.lineTo(x2,y2);
    context.stroke();
}

export function draw_rect(x : number, y : number, w : number, h : number, color : string) {
    context.lineStyle = color;
    draw_line(x,y,x+w,y,color);
    draw_line(x+w,y,x+w,y+h,color);
    draw_line(x+w,y+h,x,y+h,color);
    draw_line(x,y+h,x,y+h,color);
}

// draw_border() draws a rectangle using a border-sprite
// Useful for textboxes
// Width and Height are in subtiles (8x8)
export function draw_border(x: number, y: number, w: number, h: number, sprite: string, fill: boolean) {
    let image = assets.image_get(sprite);
    
    if(fill === true) { 
        context.drawImage(image, 8,8,8,8,x,y,w*8,h*8);
    }

    if(!image && !image.is_ready) { return; }
    for(let i = 0; i < w; i++) {
        if(i === 0) {
            context.drawImage(image, 0, 0, 8, 8, x, y, 8, 8);
            context.drawImage(image, 0, 16, 8, 8, x, y+((h-1)*8), 8, 8);
        } else
        if(i === w-1) {
            context.drawImage(image, 16, 0, 8, 8, x+(i*8), y, 8, 8);
            context.drawImage(image, 16, 16, 8, 8, x+(i*8), y+((h-1)*8), 8, 8);
        } else {
            context.drawImage(image, 8, 0, 8, 8, x+(i*8), y, 8, 8);
            context.drawImage(image, 8, 16, 8, 8, x+(i*8), y+((h-1)*8), 8, 8);
        }
    }
    for(let i = 1; i < h-1; i++) {
        context.drawImage(image, 0,8, 8, 8, x, y+(i*8), 8, 8);
        context.drawImage(image, 16,8, 8, 8, x+((w-1)*8), y+(i*8), 8, 8);
    }
}

// Quick sprite-draw function
export function draw_sprite(spr: string, x: number, y: number) {
    let image = assets.image_get(spr);
    if(image === undefined) { return; }
    if(!image && !image.is_ready) { return; }
    context.drawImage(image, 0,0,16,16,x, y,16,16);
}

// Quick-n-dirty object clone
export function clone_object(obj) {
    return JSON.parse(JSON.stringify(obj));
}

// Dice Roll
export function roll(min, max) {
    return Math.round((Math.random()*(max-min))+min);
}