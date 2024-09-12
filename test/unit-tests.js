const test = require('ava');
const version = require('../package.json').version;

test('Library shows a badge with the right version', (t) => {
    const searchStr = `%c RGB Light Card %c v${version} %c`;
    t.truthy(
        logged.find((e) => e.indexOf(searchStr) > -1),
        `The library shows a wrong version in its badge (expected: ${searchStr})`
    );
});

test('Card has CSS style', (t) => {
    const card = new RGBLightCard();
    const css = card.content.parentNode.querySelector('style').innerHTML;
    t.true(css.indexOf('.wrapper') > -1);
    t.true(css.indexOf('.color-circle') > -1);
});

test('Errors are raised if config is invalid', (t) => {
    const card = new RGBLightCard();
    t.throws(() => card.setConfig({}), { message: 'You need to define an array of colors' });
    t.throws(() => card.setConfig({ colors: {} }), { message: 'You need to define an array of colors' });
    t.throws(() => card.setConfig({ entity: 'vacuum.robot', colors: [] }), {
        message: "Entity 'vacuum.robot' must be a light",
    });
    t.throws(() => card.setConfig({ entity: 'light.example', colors: [{ type: 'automation' }] }), {
        message: "Invalid type 'automation' for colors[0]",
    });
    t.throws(() => card.setConfig({ colors: [{}] }), { message: 'You need to define entity or colors[0].entity_id' });
    t.throws(
        () => card.setConfig({ entity: 'light.example', colors: [{ type: 'scene', entity_id: 'light.example' }] }),
        { message: "Invalid type 'scene' for colors[0]" }
    );
    t.throws(() => card.setConfig({ colors: [{ entity_id: 'group.example' }] }), {
        message: "colors[0].entity_id 'group.example' must be a valid light entity",
    });
    t.throws(() => card.setConfig({ colors: [{ type: 'call-service' }] }), {
        message: 'You need to define colors[0].action',
    });
    t.throws(() => card.setConfig({ colors: [{ type: 'action' }] }), {
        message: 'You need to define colors[0].action',
    });
    t.throws(() => card.setConfig({ colors: [{ type: 'call-service', service: 'shitty_service' }] }), {
        message: "colors[0].action 'shitty_service' must be a valid action",
    });
    t.throws(() => card.setConfig({ colors: [{ type: 'action', action: 'shitty_service' }] }), {
        message: "colors[0].action 'shitty_service' must be a valid action",
    });
    t.notThrows(() => card.setConfig({ entity: 'light.example', colors: [{ hs_color: [0, 0] }] }));
});

test('Clicking the icons call the right function', (t) => {
    const card = new RGBLightCard();

    const clickOnCircle = (index) =>
        card.content.parentNode.querySelector(`.color:nth-child(${index + 1}) .color-circle`).click();

    let called = {};
    card.hass = {
        callService(domain, service, payload) {
            called = JSON.parse(JSON.stringify({ domain, service, payload }));
        },
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
    t.deepEqual(called, {
        domain: 'light',
        service: 'turn_on',
        payload: { entity_id: 'light.example', hs_color: [180, 50], brightness: 200 },
    });

    clickOnCircle(2);
    t.deepEqual(called, { domain: 'homeassistant', service: 'restart', payload: { force: true } });

    clickOnCircle(3);
    t.deepEqual(called, {
        domain: 'hue',
        service: 'hue_activate_scene',
        payload: { group_name: 'kitchen', scene_name: 'kitchen_blue' },
    });
});

test("Setting HASS creates the card, but doesn't update it", (t) => {
    const card = new RGBLightCard();
    delete card.content;
    t.falsy(card.content);
    card.setConfig({ entity: 'light.example', colors: [] });
    t.falsy(card.content);
    card.hass = null;
    t.truthy(card.content);
    const oldContent = card.content;
    card.hass = null;
    t.is(oldContent, card.content);
});

test('hide_when_off option works', (t) => {
    const card = new RGBLightCard();
    card.setConfig({ entity: 'light.example', colors: [] });
    card.hass = { states: { 'light.example': { state: 'off' } } };
    t.false(card.content.classList.contains('hidden')); // Not hidden

    card.setConfig({ entity: 'light.example', colors: [], hide_when_off: true });
    card.hass = { states: { 'light.example': { state: 'off' } } };
    t.true(card.content.classList.contains('hidden')); // Hidden

    card.hass = { states: { 'light.example': { state: 'unavailable' } } };
    t.true(card.content.classList.contains('hidden')); // Hidden

    card.hass = { states: { 'light.example': { state: 'on' } } };
    t.false(card.content.classList.contains('hidden')); // Not hidden

    card.setConfig({ colors: [], hide_when_off: true });
    card.hass = { states: { 'light.example': { state: 'off' } } };
    t.false(card.content.classList.contains('hidden')); // Not hidden
});

test('Card is added to window.customCards', (t) => {
    new RGBLightCard();
    t.is(window.customCards.length, 1);
    t.deepEqual(window.customCards[0], {
        type: 'rgb-light-card',
        name: 'RGB Light Card',
        description: 'A custom card for RGB lights',
        preview: true,
    });
});

test('Card has a stub config', (t) => {
    let conf = RGBLightCard.getStubConfig({ states: {} });
    t.is(conf.entities[1].entity, 'light.example_light');

    conf = RGBLightCard.getStubConfig({
        states: {
            'plop.light_1': { attributes: { supported_color_modes: ['hs'] }, entity_id: 'plop.light_1' },
            'light.light_2': { attributes: { supported_color_modes: ['onoff'] }, entity_id: 'light.light_2' },
            'light.light_3': { attributes: { supported_color_modes: ['onoff', 'rgb'] }, entity_id: 'light.light_3' },
        },
    });
    t.is(conf.entities.length, 2);
    t.is(conf.entities[0].entity, 'light.light_3');
    t.is(conf.entities[1].entity, 'light.light_3');
    t.is(conf.entities[1].type, 'custom:rgb-light-card');
    t.is(conf.entities[1].colors.length, 4);
});
