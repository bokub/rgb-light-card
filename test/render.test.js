import { describe, test, expect } from 'vitest';
import '../card';
import YAML from 'yamljs';

const circleMarkup = (background, innerText) =>
    `<div class="color"><div class="color-circle" style="background: ${background};"></div><div class="color-label">${
        innerText || ''
    }</div></div>`;

const styleMarkup = (str) => `<style>${str.replace(/\s\s+/g, ' ')}</style>`;

const testCases = [
    {
        name: 'Test icon colors',
        config: `---
type: custom:rgb-light-card
entity: light.example_light
colors:
- rgb_color: [255, 127, 255]
  brightness: 220
  transition: 1
- rgbw_color: [0, 127, 255, 220]
- rgbww_color: [255, 127, 0, 200, 150]
- hs_color: [60, 30]
- color_name: turquoise
- type: call-service
  service: switch.toggle
  service_data:
    entity_id: switch.garden_lights
- type: action
  action: switch.toggle
  data:
    entity_id: switch.chromecast
- hs_color: [60, 30]
  icon_color: "#fff000"
- color_temp_kelvin: 1000
- color_temp_kelvin: 2500
- color_temp_kelvin: 4000
- color_temp_kelvin: 5500
- xy_color: [0.217, 0.07]
- xy_color:
  - 0.368
  - 0.203
- brightness: 51
- brightness_pct: 41
`,
        result:
            styleMarkup(`
            .wrapper { justify-content: flex-start; margin-bottom: -4px;  margin-left: 0px; margin-right: 0px; }
            .wrapper.hidden { display: none; }
            .color-circle { width: 32px; height: 32px; margin: 4px 8px 8px; }
            .color-label { font-size: 12px; margin-bottom: 4px; }
        `) +
            circleMarkup('rgb(255, 127, 255)') +
            circleMarkup('rgb(0, 127, 255)') +
            circleMarkup('rgb(255, 127, 0)') +
            circleMarkup('hsl(60, 100%, 85%)') +
            circleMarkup('turquoise') +
            circleMarkup('rgb(127, 132, 142)') +
            circleMarkup('rgb(127, 132, 142)') +
            circleMarkup('rgb(255, 240, 0)') +
            circleMarkup('rgb(255, 160, 0)') +
            circleMarkup('rgb(255, 215, 147)') +
            circleMarkup('rgb(215, 235, 255)') +
            circleMarkup('rgb(180, 216, 255)') +
            circleMarkup('rgb(130, 0, 255)') +
            circleMarkup('rgb(254, 129, 255)') +
            circleMarkup('rgba(253, 216, 53, 0.2)') +
            circleMarkup('rgba(253, 216, 53, 0.41)'),
    },
    {
        name: 'Test justify and size options',
        config: `---
type: custom:rgb-light-card
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
            styleMarkup(`
        .wrapper { justify-content: space-around; margin-bottom: -3.5px;  margin-left: 0px; margin-right: 0px;  }
        .wrapper.hidden { display: none; }
        .color-circle { width: 28px; height: 28px; margin: 3.5px 7px 7px; }
        .color-label { font-size: 10px; margin-bottom: 3.5px; }
      `) +
            circleMarkup('rgb(234, 136, 140)') +
            circleMarkup('rgb(251, 180, 140)') +
            circleMarkup('rgb(135, 198, 237)', 'Blue'),
    },
    {
        name: 'Test tile feature version',
        config: `---
type: custom:rgb-light-card-feature
entity: light.example_light
colors:
- rgb_color: [234, 136, 140]
- rgb_color: [251, 180, 140]
- rgb_color: [135, 198, 237]
`,
        result:
            styleMarkup(`
            .wrapper { justify-content: flex-start; margin-bottom: -4px;  margin-left: -8px; margin-right: -8px; }
            .wrapper.hidden { display: none; }
            .color-circle { width: 32px; height: 32px; margin: 4px 8px 8px; }
            .color-label { font-size: 12px; margin-bottom: 4px; }
        `) +
            circleMarkup('rgb(234, 136, 140)') +
            circleMarkup('rgb(251, 180, 140)') +
            circleMarkup('rgb(135, 198, 237)'),
    },
];

describe('RGB Light Card renderings', () => {
    for (const testCase of testCases) {
        test(testCase.name || 'Unnamed test', () => {
            const parsedConfig = YAML.parse(testCase.config);
            const card =
                parsedConfig.type === 'custom:rgb-light-card-feature' ? new RGBLightCardFeature() : new RGBLightCard();
            card.setConfig(parsedConfig);
            expect(card.content.innerHTML).toBe(testCase.result);
        });
    }
});
