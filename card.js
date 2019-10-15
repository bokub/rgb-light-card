class RGBLightCard extends HTMLElement {
    set hass(hass) {
        this._hass = hass;
        if (!this.content) {
            this.init();
        }
        this.update();
    }

    init() {
        let shadow = this.attachShadow({ mode: 'open' });
        shadow.appendChild(this.getStyle());

        this.content = document.createElement('div');
        this.content.className = 'wrapper';
        this.content.onclick = ev => ev.stopPropagation();
        shadow.appendChild(this.content);
    }

    update() {
        this.content.innerHTML = '';
        for (const color of this.config.colors) {
            const element = document.createElement('div');
            element.className = 'color-circle';
            element.style = `background-color:${RGBLightCard.getColorString(color)}`;
            element.addEventListener('click', () => this.applyColor(color));
            this.content.appendChild(element);
        }
    }

    getStyle() {
        const style = document.createElement('style');
        style.textContent = `
        .wrapper { 
            cursor: auto
         }
        .color-circle { 
            display: inline-block; 
            width: 32px;
            height: 32px;
            border-radius: 50%;
            margin: 4px 8px 0;
            cursor: pointer;
            box-shadow: 0 3px 1px -2px rgba(0,0,0,.2), 0 2px 2px 0 rgba(0,0,0,.14), 0 1px 5px 0 rgba(0,0,0,.12);
            transition: box-shadow 0.15s ease-in-out;
        }
        .color-circle:hover {
            box-shadow: 0 5px 5px -3px rgba(0,0,0,.2), 0 8px 10px 1px rgba(0,0,0,.14), 0 3px 14px 2px rgba(0,0,0,.12)
        }
        `;
        return style;
    }

    setConfig(config) {
        if (!config.entity) {
            throw new Error('You need to define an entity');
        }
        if (config.entity.indexOf('light.') !== 0) {
            throw new Error(`Entity ${config.entity} is not a light`);
        }
        if (!Array.isArray(config.colors)) {
            throw new Error('You need to define an array of colors');
        }
        this.config = config;
    }

    applyColor(color) {
        this._hass.callService('light', 'turn_on', { ...color, entity_id: this.config.entity });
    }

    static getColorString(color) {
        if (color['icon_color']) {
            return color['icon_color'];
        }
        return `rgb(${color['rgb_color'].join(',')})`;
    }
}

customElements.define('rgb-light-card', RGBLightCard);
