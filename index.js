const Client = require("mpp-client-xt");

var client = new Client("wss://app.multiplayerpiano.com:443");

function HSLToRGB(h, s, l) {
    var r, g, b;

    if(s == 0){
        r = g = b = l; // achromatic
    }else{
        var hue2rgb = function hue2rgb(p, q, t){
            if(t < 0) t += 1;
            if(t > 1) t -= 1;
            if(t < 1/6) return p + (q - p) * 6 * t;
            if(t < 1/2) return q;
            if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
        }

        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        var p = 2 * l - q;
        r = hue2rgb(p, q, h + 1/3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1/3);
    }

    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}
  
function rgbToHex(r, g, b) {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

var h = 0;
var s = 1;
var l = .3;

client.start();
client.setChannel('Another room');

client.on('hi', () => {
    console.log('Online');
});

setInterval(() => {
    h += .001;
}, 100);

setInterval(() => {
    if (h >= 1) {
        h = 0;
    }
    hsl = HSLToRGB(h, s, l);
    if (client.isOwner()) {
        console.log(rgbToHex(hsl[0]-64, hsl[1]-64, hsl[2]-64).split('-').join(''))
        client.sendArray([{m:'chset', set:{color: rgbToHex(hsl[0]-64, hsl[1]-64, hsl[2]-64).split('-').join('')}}]);
    }
}, 750);