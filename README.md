# RGB Light Card

[![Codecov][codecov-src]][codecov-href]
[![Version][version-src]][version-href]
[![HACS: Default][hacs-src]][hacs-href]
[![Downloads][downloads-src]][downloads-href]
[![Hits per month][hits-src]][hits-href]
[![code style: prettier][code-style-src]][code-style-href]

> A Lovelace custom card for RGB lights

![Light](https://github.com/bokub/rgb-light-card/raw/images/light.png)
![Dark](https://github.com/bokub/rgb-light-card/raw/images/dark.png)

## Installation

If you have [HACS](https://hacs.xyz/), you can install the RGB Light Card from there and jump to the "Configuration" step

Otherwise, follow these simple steps:

1. In your home assistant, go to the `/config/lovelace/resources` page, or navigate to Configuration > Lovelace Dashboards > Resources tab

2. Click the **+** button

3. Set the URL to `https://cdn.jsdelivr.net/npm/rgb-light-card` and keep "JavaScript Module" as the resource type

4. Click "Create"

**Note:** The RGB Light Card will upgrade automatically a few days after every new release (once your browser cache expires)

However, you can enforce a [specific version](https://github.com/bokub/rgb-light-card/releases) by adding `@X.X.X` at the end of the URL (e.g: `https://[...]/rgb-light-card@1.8.0`)

## Configuration

The `rgb-light-card` is meant to be included in the [Lovelace Entities Card](https://www.home-assistant.io/lovelace/entities/)

You can start with a sample configuration by choosing "**Custom: RGB Light Card**" in the Lovelace card picker

Example configuration:

```yaml
type: entities
show_header_toggle: false
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

| Name            | Type    | Requirement  | Default | Description                                                                                                                                                                       |
| --------------- | ------- | ------------ | ------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `type`          | string  | **Required** |         | `custom:rgb-light-card`                                                                                                                                                           |
| `entity`        | string  | **Optional** |         | Entity to control. Must be a light or a [light group](https://www.home-assistant.io/integrations/light.group/). If you don't define it, `entity_id` must be defined in each color |
| `colors`        | array   | **Required** |         | Colors to display. Check out color options below                                                                                                                                  |
| `justify`       | string  | **Optional** | `left`  | How to distribute free space between icons. Possible values are `left`,`right`,`center`,`between` and `around`. Check out [examples](#justify) below                              |
| `size`          | number  | **Optional** | `32`    | Diameter of the icons, in pixels                                                                                                                                                  |
| `label_size`    | number  | **Optional** | `12`    | Size of the labels font, in pixels                                                                                                                                                |
| `hide_when_off` | boolean | **Optional** | `false` | Hide all the icons if the entity state is `off` or `unavailable`                                                                                                                  |

### Colors options

| Name                                                       | Type   | Requirement  | Default | Description                                                                                                                                                                                                                                        |
| ---------------------------------------------------------- | ------ | ------------ | ------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `rgb_color`, `hs_color`, `brightness`, `transition` etc... | any    | **Optional** |         | When you click on a color, it will call the service `light.turn_on` with **all the options you put here** as service data<br> [**Click here**](https://www.home-assistant.io/integrations/light#service-lightturn_on) for the full list of options |
| `icon_color`                                               | string | **Optional** |         | Override icon color. Check out [examples](#icon-color) below                                                                                                                                                                                       |
| `label`                                                    | string | **Optional** |         | Optional color label. Check out [examples](#labels) below                                                                                                                                                                                          |
| `entity_id`                                                | string | **Optional** |         | Override the `entity` option for this specific color                                                                                                                                                                                               |
| `type`                                                     | string | **Optional** | `light` | Can be set to `light` (default), or `call-service` to change the click action. Read the [explanation](#calling-services) just below                                                                                                                |
| `service`                                                  | string | **Optional** |         | Used with the `call-service` type to specify the service to call for the click action                                                                                                                                                              |
| `service_data`                                             | array  | **Optional** |         | Used with the `call-service` type to specify the data to be passed to the service                                                                                                                                                                  |

## Calling Services

By default, clicking an icon calls the `light.turn_on` service with the options you defined.

If you want more flexibility, you can use `type: call-service` to call a different service, with optional data in a `service_data` object.

You can find more information about service calls in the [Home Assistant documentation](https://www.home-assistant.io/docs/scripts/service-calls/)

Example configuration:

```yaml
type: entities
entities:
    - type: 'custom:rgb-light-card'
      colors:
          # First icon calls a script
          - type: call-service
            service: script.turn_on
            service_data:
                entity_id: script.night_mode
            icon_color: '#90b2ec'
          # Second icon calls a scene
          - type: call-service
            service: scene.turn_on
            service_data:
                entity_id: scene.romantic
            icon_color: '#f1a5cb'
          # Third icon sends an Alexa TTS notification
          - type: call-service
            service: notify.alexa_media_office
            service_data:
                data:
                    type: tts
                message: Hello world!
            icon_color: '#77e28a'
```

Note that you can mix lights and service calls in the same card

The `icon_color` is still optional, but will be grey by default

## Customization examples

### Icon color

The `icon_color` option accepts the same values as the [CSS background property](https://developer.mozilla.org/docs/Web/CSS/background).

This means your `icon_color` can be:

-   A HTML color name: &nbsp; `icon_color: gold`
-   A hexadecimal code: &nbsp; `icon_color: '#FBB48C'`
-   Any other color compatible with [background-color](https://developer.mozilla.org/docs/Web/CSS/background-color): &nbsp; `icon_color: rgba(42, 204, 77, 0.5)`
-   A color gradient: &nbsp; `icon_color: 'linear-gradient(15deg, #0250c5, #d43f8d)'`
-   Or even an image: &nbsp; `icon_color: center/120% url('https://www.home-assistant.io/images/favicon-192x192.png')`

The 5 examples above will render like this:

![Light icon color examples](https://github.com/bokub/rgb-light-card/raw/images/icon_color_light.png)
![Dark icon color examples](https://github.com/bokub/rgb-light-card/raw/images/icon_color_dark.png)

⚠️ You **must** wrap your value between quotes if it contains the `#` character

### Material design icons

As explained above, the `icon_color` option accepts any valid CSS value

If you want icons in your colors, you can use the [icon tool](https://bokub.github.io/rgb-light-card/test/icon.html)
to convert [material design icons](https://materialdesignicons.com/) into CSS

![Light icons examples](https://github.com/bokub/rgb-light-card/raw/images/icons_light.png)
![Dark icons examples](https://github.com/bokub/rgb-light-card/raw/images/icons_dark.png)

### Labels

Small labels can be added below color icons, using the `label` option of each color.
Their size can be customized with the `label_size` option (default to 12 pixels).

Labels can be just a text, but also accept HTML, which means you can be really creative:

-   Simple text: `label: Red`
-   Bold text: `label: <b>Orange</b>`
-   Or more complex HTML: `label: '<span style="color: #609fc6">Blue</span>'`

![Light label examples](https://github.com/bokub/rgb-light-card/raw/images/labels_light.png)
![Dark label examples](https://github.com/bokub/rgb-light-card/raw/images/labels_dark.png)

### Justify

There are 5 possible values for the `justify` option: `left`,`right`,`center`,`between` and `around`. The default value is `left`.

Here are how the different values are handled:

![Light justify examples](https://github.com/bokub/rgb-light-card/raw/images/justify_light.png)
![Dark justify examples](https://github.com/bokub/rgb-light-card/raw/images/justify_dark.png)

## License

MIT © [Boris K](https://github.com/bokub)

[version-src]: https://gradgen.bokub.workers.dev/npm/v/rgb-light-card?gradient=b65cff,11cbfa&style=flat&label=version
[code-style-src]: https://flat.badgen.net/badge/code%20style/prettier/ff69b4
[hits-src]: https://data.jsdelivr.com/v1/package/npm/rgb-light-card/badge
[downloads-src]: https://flat.badgen.net/github/assets-dl/bokub/rgb-light-card/1.11.0?label=installs%20(HACS)
[hacs-src]: https://flat.badgen.net/badge/HACS/default/orange
[codecov-src]: https://img.shields.io/codecov/c/github/bokub/rgb-light-card?style=flat-square
[version-href]: https://www.npmjs.com/package/rgb-light-card
[code-style-href]: https://github.com/bokub/prettier-config
[hits-href]: https://www.jsdelivr.com/package/npm/rgb-light-card
[downloads-href]: https://api.github.com/repos/bokub/rgb-light-card/releases/assets/58896952
[hacs-href]: https://hacs.xyz/
[codecov-href]: https://codecov.io/gh/bokub/rgb-light-card
