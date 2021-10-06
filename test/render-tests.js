const test = require('ava');
const YAML = require('yamljs');

const testCases = [
    {
        name: 'Test icon colors',
        config: `---
entity: light.example_light
colors:
- rgb_color: [255, 127, 255]
  brightness: 220
  transition: 1
- hs_color: [60, 30]
- color_name: turquoise
- type: call-service
  service: switch.toggle
  service_data:
    entity_id: switch.garden_lights
- type: script
  entity_id: script.night_mode
- hs_color: [60, 30]
  icon_color: "#fff000"
- color_temp: 100
- color_temp: 540
- color_temp: 360
- kelvin: 4000
- xy_color: [0.217, 0.07]
- xy_color:
  - 0.368
  - 0.203
`,
        result:
            '<style> .wrapper { justify-content: flex-start; margin-bottom: -4px; } .wrapper.hidden { display: none; } .color-circle { width: 32px; height: 32px; margin: 4px 8px 8px; } .color-label { font-size: 12px; margin-bottom: 4px; } </style>' +
            '<div class="color"><div class="color-circle" style="background: rgb(255, 127, 255);"></div><div class="color-label"></div></div>' +
            '<div class="color"><div class="color-circle" style="background: hsl(60, 100%, 85%);"></div><div class="color-label"></div></div>' +
            '<div class="color"><div class="color-circle" style="background: turquoise;"></div><div class="color-label"></div></div>' +
            '<div class="color"><div class="color-circle" style="background: rgb(127, 132, 142);"></div><div class="color-label"></div></div>' +
            '<div class="color"><div class="color-circle" style="background: rgb(127, 132, 142);"></div><div class="color-label"></div></div>' +
            '<div class="color"><div class="color-circle" style="background: rgb(255, 240, 0);"></div><div class="color-label"></div></div>' +
            '<div class="color"><div class="color-circle" style="background: rgb(166, 209, 255);"></div><div class="color-label"></div></div>' +
            '<div class="color"><div class="color-circle" style="background: rgb(255, 160, 0);"></div><div class="color-label"></div></div>' +
            '<div class="color"><div class="color-circle" style="background: rgb(255, 237, 206);"></div><div class="color-label"></div></div>' +
            '<div class="color"><div class="color-circle" style="background: rgb(215, 235, 255);"></div><div class="color-label"></div></div>' +
            '<div class="color"><div class="color-circle" style="background: rgb(130, 0, 255);"></div><div class="color-label"></div></div>' +
            '<div class="color"><div class="color-circle" style="background: rgb(254, 129, 255);"></div><div class="color-label"></div></div>',
    },
    {
        name: 'Test justify and size options',
        config: `---
entity: light.example_light
colors:
- rgb_color: [234, 136, 140]
- rgb_color: [251, 180, 140]
- rgb_color: [135, 198, 237]
  label: Blue
justify: around
size: 28
label_size: 10
`,
        result:
            '<style> .wrapper { justify-content: space-around; margin-bottom: -3.5px; } .wrapper.hidden { display: none; } .color-circle { width: 28px; height: 28px; margin: 3.5px 7px 7px; } .color-label { font-size: 10px; margin-bottom: 3.5px; } </style>' +
            '<div class="color"><div class="color-circle" style="background: rgb(234, 136, 140);"></div><div class="color-label"></div></div>' +
            '<div class="color"><div class="color-circle" style="background: rgb(251, 180, 140);"></div><div class="color-label"></div></div>' +
            '<div class="color"><div class="color-circle" style="background: rgb(135, 198, 237);"></div><div class="color-label">Blue</div></div>',
    },
];

for (const testCase of testCases) {
    test(testCase.name || 'Unnamed test', (t) => {
        const card = new RGBLightCard();
        if (testCase.config) {
            card.setConfig(YAML.parse(testCase.config));
        }
        t.is(card.content.innerHTML, testCase.result);
    });
}
