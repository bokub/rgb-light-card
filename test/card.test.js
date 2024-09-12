import { describe, test, expect } from 'vitest';
import '../card';
const version = require('../package.json').version;

describe('RGB Light Card', () => {
    test('Library shows a badge with the right version', () => {
        const searchStr = `%c RGB Light Card %c v${version} %c`;
        expect(logged.find((e) => e.indexOf(searchStr) > -1)).toBeTruthy();
    });

    test('Card has CSS style', () => {
        const card = new RGBLightCard();
        const css = card.content.parentNode.querySelector('style').innerHTML;
        expect(css.indexOf('.wrapper')).toBeGreaterThan(-1);
        expect(css.indexOf('.color-circle')).toBeGreaterThan(-1);
    });

    test('Errors are raised if config is invalid', () => {
        const card = new RGBLightCard();
        expect(() => card.setConfig({})).toThrowError('You need to define an array of colors');
        expect(() => card.setConfig({ colors: {} })).toThrowError('You need to define an array of colors');
        expect(() => card.setConfig({ entity: 'vacuum.robot', colors: [] })).toThrowError(
            "Entity 'vacuum.robot' must be a light"
        );
        expect(() => card.setConfig({ entity: 'light.example', colors: [{ type: 'automation' }] })).toThrowError(
            "Invalid type 'automation' for colors[0]"
        );
        expect(() => card.setConfig({ colors: [{}] })).toThrowError('You need to define entity or colors[0].entity_id');
        expect(() =>
            card.setConfig({ entity: 'light.example', colors: [{ type: 'scene', entity_id: 'light.example' }] })
        ).toThrowError("Invalid type 'scene' for colors[0]");
        expect(() => card.setConfig({ colors: [{ entity_id: 'group.example' }] })).toThrowError(
            "colors[0].entity_id 'group.example' must be a valid light entity"
        );
        expect(() => card.setConfig({ colors: [{ type: 'call-service' }] })).toThrowError(
            'You need to define colors[0].action'
        );
        expect(() => card.setConfig({ colors: [{ type: 'action' }] })).toThrowError(
            'You need to define colors[0].action'
        );
        expect(() => card.setConfig({ colors: [{ type: 'call-service', service: 'shitty_service' }] })).toThrowError(
            "colors[0].action 'shitty_service' must be a valid action"
        );
        expect(() => card.setConfig({ colors: [{ type: 'action', action: 'shitty_service' }] })).toThrowError(
            "colors[0].action 'shitty_service' must be a valid action"
        );
        expect(() => card.setConfig({ entity: 'light.example', colors: [{ hs_color: [0, 0] }] })).not.toThrow();
    });

    test('Clicking the icons call the right function', () => {
        const card = new RGBLightCard();

        const clickOnCircle = (index) =>
            card.content.parentNode.querySelector(`.color:nth-child(${index + 1}) .color-circle`).click();

        let called = {};
        card.hass = {
            callService(domain, service, payload) {
                called = JSON.parse(JSON.stringify({ domain, service, payload }));
            },
        };

        let vibrations = 0;
        window.dispatchEvent = (event) => {
            if (event.type === 'haptic') vibrations++;
        };

        card.setConfig({
            entity: 'light.example',
            colors: [
                { hs_color: [180, 50], brightness: 200 },
                {
                    type: 'call-service', // Deprecated config, but should still work
                    service: 'homeassistant.restart',
                    service_data: { force: true },
                },
                {
                    type: 'action',
                    action: 'hue.hue_activate_scene',
                    data: { group_name: 'kitchen', scene_name: 'kitchen_blue' },
                },
            ],
        });

        clickOnCircle(1);
        expect(vibrations).toBe(1);
        expect(called).toEqual({
            domain: 'light',
            service: 'turn_on',
            payload: { entity_id: 'light.example', hs_color: [180, 50], brightness: 200 },
        });

        clickOnCircle(2);
        expect(vibrations).toBe(2);
        expect(called).toEqual({ domain: 'homeassistant', service: 'restart', payload: { force: true } });

        clickOnCircle(3);
        expect(vibrations).toBe(3);
        expect(called).toEqual({
            domain: 'hue',
            service: 'hue_activate_scene',
            payload: { group_name: 'kitchen', scene_name: 'kitchen_blue' },
        });
    });

    test("Setting HASS creates the card, but doesn't update it", () => {
        const card = new RGBLightCard();
        delete card.content;
        expect(card.content).toBeFalsy();
        card.setConfig({ entity: 'light.example', colors: [] });
        expect(card.content).toBeFalsy();
        card.hass = null;
        expect(card.content).toBeTruthy();
        const oldContent = card.content;
        card.hass = null;
        expect(oldContent).toBe(card.content);
    });

    test('hide_when_off option works', () => {
        const card = new RGBLightCard();
        card.setConfig({ entity: 'light.example', colors: [] });
        card.hass = { states: { 'light.example': { state: 'off' } } };
        expect(card.content.classList.contains('hidden')).toBeFalsy(); // Not hidden

        card.setConfig({ entity: 'light.example', colors: [], hide_when_off: true });
        card.hass = { states: { 'light.example': { state: 'off' } } };
        expect(card.content.classList.contains('hidden')).toBeTruthy(); // Hidden

        card.hass = { states: { 'light.example': { state: 'unavailable' } } };
        expect(card.content.classList.contains('hidden')).toBeTruthy(); // Hidden

        card.hass = { states: { 'light.example': { state: 'on' } } };
        expect(card.content.classList.contains('hidden')).toBeFalsy(); // Not hidden

        card.setConfig({ colors: [], hide_when_off: true });
        card.hass = { states: { 'light.example': { state: 'off' } } };
        expect(card.content.classList.contains('hidden')).toBeFalsy(); // Not hidden
    });

    test('Card is added to window.customCards', () => {
        new RGBLightCard();
        expect(window.customCards.length).toBe(1);
        expect(window.customCards[0]).toEqual({
            type: 'rgb-light-card',
            name: 'RGB Light Card',
            description: 'A custom card for RGB lights',
            preview: true,
        });
    });

    test('Card has a stub config', () => {
        let conf = RGBLightCard.getStubConfig({ states: {} });
        expect(conf.entities[1].entity).toBe('light.example_light');

        conf = RGBLightCard.getStubConfig({
            states: {
                'plop.light_1': { attributes: { supported_color_modes: ['hs'] }, entity_id: 'plop.light_1' },
                'light.light_2': { attributes: { supported_color_modes: ['onoff'] }, entity_id: 'light.light_2' },
                'light.light_3': {
                    attributes: { supported_color_modes: ['onoff', 'rgb'] },
                    entity_id: 'light.light_3',
                },
            },
        });
        expect(conf.entities.length).toBe(2);
        expect(conf.entities[0].entity).toBe('light.light_3');
        expect(conf.entities[1].entity).toBe('light.light_3');
        expect(conf.entities[1].type).toBe('custom:rgb-light-card');
        expect(conf.entities[1].colors.length).toBe(4);
    });
});
