# RGB Light Card

[![Version][version-src]][version-href]
[![code style: prettier][code-style-src]][code-style-href]

> A Lovelace custom card for RGB lights

![Light](https://github.com/bokub/rgb-light-card/raw/images/light.png)
![Dark](https://github.com/bokub/rgb-light-card/raw/images/dark.png)

## Installation

#### 1. Open the Raw Config Editor

<details><summary>(Click to expand)</summary>

1. Go to your Lovelace view

2. Click on the three dots menu (top-right) and click on _Configure UI_.

3. Click in the three dots menu again and click on _Raw config editor_.

</details>

#### 2. Add the `rgb-light-card` to the resources

Add the following resource to your configuration (typically at the top) :

```yaml
resources:
    - url: https://cdn.jsdelivr.net/npm/rgb-light-card
      type: js
```

## Configuration

The `rbg-light-card` is meant to be included in the [Lovelace Entities Card](https://www.home-assistant.io/lovelace/entities/)

Example configuration:

```yaml
type: entities
entities:
    - entity: light.example_light

    # Card configuration starts here
    - type: 'custom:rgb-light-card'
      entity: light.example_light
      colors:
          - rgb_color:
                - 255
                - 127
                - 255
            brightness: 100
          - rgb_color:
                - 0
                - 0
                - 0
            icon_color: '#fff8b0'
```

### Options

| Name   | Type   | Requirement  | Description                          |
| ------ | ------ | ------------ | ------------------------------------ |
| type   | string | **Required** | `custom:rgb-light-card`              |
| name   | string | **Required** | Light entity to control              |
| colors | array  | **Required** | Colors to display. See options below |

### Colors options

| Name                                                                                                    | Type   | Requirement  | Description                                                                                                                                                                                                                               |
| ------------------------------------------------------------------------------------------------------- | ------ | ------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Any option of [`light.turn_on`](https://www.home-assistant.io/integrations/light/#service-lightturn_on) | any    | **Optional** | When you click on a color, the card will call the service [`light.turn_on`](https://www.home-assistant.io/integrations/light/#service-lightturn_on) with all the options you put here, such as `rgb_color`, `brightness`, `transition`... |
| icon_color                                                                                              | string | **Optional** | Override icon color. Check out examples below                                                                                                                                                                                             |
| justify                                                                                                 | string | **Optional** | Control how to distribute free space between icons. Possible values are `left`,`right`,`center`,`between` and `around`. The default value is `left`. Check out examples below                                                             |

## Examples

### Icon color

The `icon_color` option accepts the same values as the [CSS background property](https://developer.mozilla.org/docs/Web/CSS/background).

This means your `icon_color` can be:

-   A HTML color name: &nbsp; `icon_color: gold`
-   A hexadecimal code: &nbsp; `icon_color: '#FBB48C'`
-   Any other color compatible with [background-color](https://developer.mozilla.org/docs/Web/CSS/background-color): &nbsp; `icon_color: rgba(42, 204, 77, 0.5)`
-   A color gradient: &nbsp; `icon_color: 'linear-gradient(15deg, #0250c5 0%, #d43f8d 100%)'`
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
[version-href]: https://www.npmjs.com/package/rgb-light-card
[code-style-href]: https://github.com/prettier/prettier
