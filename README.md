# RGB Light Card

[![Version][version-src]][version-href]
[![HACS: Default][hacs-src]][hacs-href]
[![LGTM][lgtm-src]][lgtm-href]
[![Hits per month][hits-src]][hits-href]
[![code style: prettier][code-style-src]][code-style-href]

> A Lovelace custom card for RGB lights

![Light](https://github.com/bokub/rgb-light-card/raw/images/light.png)
![Dark](https://github.com/bokub/rgb-light-card/raw/images/dark.png)

## Installation

You can either install this card through [HACS](https://github.com/custom-components/hacs), or follow these simple steps:

#### 1. Open the Raw Config Editor

<details><summary>(Click to expand)</summary>

1. Go to your Lovelace view

2. Click on the three dots menu (top-right) and click on _Configure UI_.

3. Click in the three dots menu again and click on _Raw config editor_.

</details>

#### 2. Add the `rgb-light-card` to the resources

Add the following resource to your Lovelace configuration (typically at the top) :

```yaml
resources:
    - url: https://cdn.jsdelivr.net/npm/rgb-light-card
      type: js
```

## Updating

The RGB Light Card will auto-update automatically a few days after every new release (once your browser cache expires)

However, you can enforce a [specific version](https://github.com/bokub/rgb-light-card/releases) by adding `@X.X.X` at the end of the URL (e.g: `- url: ...@1.2.0`)

## Configuration

The `rbg-light-card` is meant to be included in the [Lovelace Entities Card](https://www.home-assistant.io/lovelace/entities/)

Example configuration:

```yaml
type: entities
entities:
    # Displays the light entity. It's optional
    - entity: light.example_light

    # Card configuration starts here
    - type: 'custom:rgb-light-card'
      entity: light.example_light
      colors:
          # Any option of the light.turn_on service can be used in each color
          - rgb_color:
                - 255
                - 127
                - 255
            brightness: 220
            transition: 1
          - hs_color:
                - 60
                - 30
            icon_color: '#fff8b0' # Override icon color
```

> #### Pro tip
>
> You can test all the colors options in the **Developer Tools > Service** page of your Home Assistant.
>
> Choose the `light.turn_on` service, change the service data, and call the service to see the result

### Options

| Name      | Type   | Requirement  | Default | Description                                                                                                                                          |
| --------- | ------ | ------------ | ------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| `type`    | string | **Required** |         | `custom:rgb-light-card`                                                                                                                              |
| `entity`  | string | **Optional** |         | Light entity to control. If not set here, `entity_id` must be set in each color                                                                      |
| `colors`  | array  | **Required** |         | Colors to display. Check out color options below                                                                                                     |
| `justify` | string | **Optional** | `left`  | How to distribute free space between icons. Possible values are `left`,`right`,`center`,`between` and `around`. Check out [examples](#justify) below |
| `size`    | number | **Optional** | `32`    | Diameter of the icons, in pixels                                                                                                                     |

### Colors options

| Name                                                       | Type   | Requirement  | Default | Description                                                                                                                                                                                                                                                              |
| ---------------------------------------------------------- | ------ | ------------ | ------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------                       |
| `rgb_color`, `hs_color`, `brightness`, `transition` etc... | any    | **Optional** |         | When you click on a color, it will call the service `light.turn_on` with **all the options you put here** as service data<br> [**Click here**](https://www.home-assistant.io/integrations/light#service-lightturn_on) for the full list of options                       |
| `icon_color`                                               | string | **Optional** |         | Override icon color. Check out [examples](#icon-color) below                                                                                                                                                                                                             |
| `type`                                                     | string | **Optional** | `light` | Can be set to `light`, `script`, `scene` or `call-service` to change the click action. Read the [explanation](#calling-scripts-and-scenes) just below                                                                                                                    |
| `entity_id`                                                | string | **Optional** |         | Override the `entity` option for this specific color                                                                                                                                                                                                                     |
| `service`                                                  | string | **Optional** |         | Used with `call-service` type to specify the service to call for the click action. More information can be found on the [Home Assistant Service Calls](https://www.home-assistant.io/docs/scripts/service-calls/) page. Read [more information](#calling-services) below |
| `service_data`                                             | array  | **Optional** |         | Used with `call-service` type to specify the data to be passed to the service. Read [more information](#calling-services) below                                                                                                                                          |

## Calling scripts and scenes

By default, clicking an icon calls the service `light.turn_on` with the defined options, but you can also call a [script](https://www.home-assistant.io/integrations/script) or a [scene](https://www.home-assistant.io/integrations/scene) instead. That's what the `type` option is made for.

Scripts and scenes are good ways to set multiple lights at once, as well as other entities

Example configuration:

```yaml
type: entities
entities:
    - type: 'custom:rgb-light-card'
      colors:
          # First icon calls a script
          - type: script
            entity_id: script.night_mode
            icon_color: 'linear-gradient(#777777, #151515)'
          # Second icon calls a scene
          - type: scene
            entity_id: scene.romantic
            icon_color: 'linear-gradient(25deg, #ba71ff, #ff53b9)'
```

As you can see, an `entity_id` must be set for each script or scene

The `icon_color` is still optional, but will be grey by default

Note that you can mix lights, scripts and scenes in the same card

### Calling Services

This can call any service available on Home Assistant. The official [Home Assistant Service Calls](https://www.home-assistant.io/docs/scripts/service-calls/) documentation can be used for reference.

> #### Pro tip
>
> You can view all services available the **Developer Tools > Service** page of your Home Assistant

Example configuration:

```yaml
type: entities
entities:
    - type: 'custom:rgb-light-card'
      colors:
          # First icon calls a switch to toggle
          - type: call-service
            service: switch.toggle
            service_data:
              entity_id: switch.garden_lights
            icon_color: 'linear-gradient(20deg, #06a122, #fffe8e)'
          # Second icon calls a Phillips Hue scene
          - type: call-service
            service: hue.hue_activate_scene
            service_data:
              group_name: Kitchen
              scene_name: Kitchen Blue
            icon_color: 'linear-gradient(200deg, #fffe8e, #005fff)'
          # Third icon send an Alexa TTS notification
          - type: call-service
            service: notify.alexa_media_office
            service_data:
              data:
                type: tts
              message: Test message
            icon_color: 'linear-gradient(90deg, #ff0000, #ffff00)'
```

For example to call a Phillips Hue scene with `hue.hue_activate_scene`.

## Examples

### Icon color

The `icon_color` option accepts the same values as the [CSS background property](https://developer.mozilla.org/docs/Web/CSS/background).

This means your `icon_color` can be:

-   A HTML color name: &nbsp; `icon_color: gold`
-   A hexadecimal code: &nbsp; `icon_color: '#FBB48C'`
-   Any other color compatible with [background-color](https://developer.mozilla.org/docs/Web/CSS/background-color): &nbsp; `icon_color: rgba(42, 204, 77, 0.5)`
-   A color gradient: &nbsp; `icon_color: 'linear-gradient(15deg, #0250c5, #d43f8d)'`
-   Or even an image: &nbsp; `icon_color: center/120% url('https://www.home-assistant.io/images/favicon-192x192.png')`

The 5 examples above will render like this:

![Icon color examples](https://github.com/bokub/rgb-light-card/raw/images/icon_color_examples.png)

⚠️ You **must** wrap your value between quotes if it contains the `#` character

### Justify

There are 5 possible values for the `justify` option: `left`,`right`,`center`,`between` and `around`. The default value is `left`.

Here are how the different values are handled:

![Justify examples](https://github.com/bokub/rgb-light-card/raw/images/justify_examples.png)

## License

MIT © [Boris K](https://github.com/bokub)

[version-src]: https://runkit.io/bokub/npm-version/branches/master/rgb-light-card?style=flat
[code-style-src]: https://flat.badgen.net/badge/code%20style/prettier/ff69b4
[hits-src]: https://data.jsdelivr.com/v1/package/npm/rgb-light-card/badge
[hacs-src]: https://flat.badgen.net/badge/HACS/default/orange
[lgtm-src]: https://flat.badgen.net/lgtm/grade/g/bokub/rgb-light-card?label=code%20quality
[version-href]: https://www.npmjs.com/package/rgb-light-card
[code-style-href]: https://github.com/prettier/prettier
[hits-href]: https://www.jsdelivr.com/package/npm/rgb-light-card
[hacs-href]: https://github.com/custom-components/hacs
[lgtm-href]: https://lgtm.com/projects/g/bokub/rgb-light-card
