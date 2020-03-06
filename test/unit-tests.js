const test = require('ava');
const version = require('../package.json').version;

test('Library shows a badge with the right version', t => {
    const searchStr = `%c RGB Light Card %c v${version} %c`;
    t.truthy(
        logged.find(e => e.indexOf(searchStr) > -1),
        `The library shows a wrong version in its badge (expected: ${searchStr})`
    );
});

test('Card has CSS style', t => {
    const card = new RGBLightCard();
    const css = card.content.parentNode.querySelector('style').innerHTML;
    t.true(css.indexOf('.wrapper') > -1);
    t.true(css.indexOf('.color-circle') > -1);
});

test('Errors are raised if config is invalid', t => {
    const card = new RGBLightCard();
    t.throws(() => card.setConfig({}), 'You need to define an array of colors');
    t.throws(() => card.setConfig({ colors: {} }), 'You need to define an array of colors');
    t.throws(() => card.setConfig({ entity: 'vacuum.robot', colors: [] }), "Entity 'vacuum.robot' must be a light");
    t.throws(
        () => card.setConfig({ entity: 'light.example', colors: [{ type: 'automation' }] }),
        "Invalid type 'automation' for colors[0]"
    );
    t.throws(() => card.setConfig({ colors: [{}] }), 'You need to define entity or colors[0].entity_id');
    t.throws(
        () => card.setConfig({ entity: 'light.example', colors: [{ type: 'scene' }] }),
        'You need to define colors[0].entity_id'
    );
    t.throws(
        () => card.setConfig({ entity: 'light.example', colors: [{ type: 'scene', entity_id: 'light.example' }] }),
        "colors[0].entity_id 'light.example' must be a scene"
    );
    t.throws(
        () => card.setConfig({ colors: [{ entity_id: 'group.example' }] }),
        "colors[0].entity_id 'group.example' must be a valid light entity"
    );
    t.throws(() => card.setConfig({ colors: [{ type: 'call-service' }] }), 'You need to define colors[0].service');
    t.throws(
        () => card.setConfig({ colors: [{ type: 'call-service', service: 'shitty_service' }] }),
        "colors[0].service 'shitty_service' must be a valid service"
    );
    t.notThrows(() => card.setConfig({ entity: 'light.example', colors: [{ hs_color: [0, 0] }] }));
});

test('Clicking the icons call the right function', t => {
    const card = new RGBLightCard();
    let called = {};
    card.hass = {
        callService(domain, service, payload) {
            called = JSON.parse(JSON.stringify({ domain, service, payload }));
        }
    };
    card.setConfig({
        entity: 'light.example',
        colors: [
            { hs_color: [180, 50], brightness: 200 },
            { type: 'scene', entity_id: 'scene.romantic' }, // Deprecated config, but should still work
            { type: 'script', entity_id: 'script.night_mode' }, // Deprecated config, but should still work
            { type: 'call-service', service: 'homeassistant.restart' },
            {
                type: 'call-service',
                service: 'hue.hue_activate_scene',
                service_data: { group_name: 'kitchen', scene_name: 'kitchen_blue' }
            }
        ]
    });
    card.content.parentNode.querySelector('.color-circle:nth-child(2)').click();
    t.deepEqual(called, {
        domain: 'light',
        service: 'turn_on',
        payload: { entity_id: 'light.example', hs_color: [180, 50], brightness: 200 }
    });

    card.content.parentNode.querySelector('.color-circle:nth-child(3)').click();
    t.deepEqual(called, { domain: 'scene', service: 'turn_on', payload: { entity_id: 'scene.romantic' } });

    card.content.parentNode.querySelector('.color-circle:nth-child(4)').click();
    t.deepEqual(called, { domain: 'script', service: 'turn_on', payload: { entity_id: 'script.night_mode' } });

    card.content.parentNode.querySelector('.color-circle:nth-child(5)').click();
    t.deepEqual(called, { domain: 'homeassistant', service: 'restart', payload: {} });

    card.content.parentNode.querySelector('.color-circle:nth-child(6)').click();
    t.deepEqual(called, {
        domain: 'hue',
        service: 'hue_activate_scene',
        payload: { group_name: 'kitchen', scene_name: 'kitchen_blue' }
    });
});

test("Setting HASS creates the card, but doesn't update it", t => {
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

test('Hide when off option works ', t => {
    const card = new RGBLightCard();
    card.setConfig({ entity: 'light.example', colors: [] });
    card.hass = { states: { 'light.example': { state: 'off' } } };
    t.false(card.content.classList.contains('hidden')); // Not hidden

    card.setConfig({ entity: 'light.example', colors: [], hide_when_off: true });
    card.hass = { states: { 'light.example': { state: 'off' } } };
    t.true(card.content.classList.contains('hidden')); // Hidden

    card.hass = { states: { 'light.example': { state: 'on' } } };
    t.false(card.content.classList.contains('hidden')); // Not hidden
});
