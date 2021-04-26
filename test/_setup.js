const browserEnv = require('browser-env');
browserEnv(['document']);

// Mock customElements.define()
global.customElements = {
    define(name, constructor) {
        if (name === 'rgb-light-card') {
            global.RGBLightCard = constructor;
        }
    },
};

// Mock HTMLElement
global.HTMLElement = class HTMLElement {
    constructor() {
        this.init();
    }
    attachShadow() {
        const shadow = document.createElement('div');
        document.body.appendChild(shadow);
        return shadow;
    }
};

// Mock console.info()
global.logged = [];
console.info = (...args) => {
    logged.push(args.join(' '));
};

// Mock window for window.customCards
global.window = {};
