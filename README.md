# RGB Light Card

[![Version][version-src]][version-href]
[![HACS: Default][hacs-src]][hacs-href]
[![LGTM][lgtm-src]][lgtm-href]
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

### Options

| Name    | Type   | Requirement  | Default | Description                                                                                                                              |
| ------- | ------ | ------------ | ------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| type    | string | **Required** |         | `custom:rgb-light-card`                                                                                                                  |
| name    | string | **Required** |         | Light entity to control                                                                                                                  |
| colors  | array  | **Required** |         | Colors to display. Check out color options below                                                                                         |
| justify | string | **Optional** | `left`  | How to distribute free space between icons. Possible values are `left`,`right`,`center`,`between` and `around`. Check out examples below |
| size    | number | **Optional** | `32`    | Diameter of the icons, in pixels                                                                                                         |

### Colors options

| Name                                                                                                    | Type   | Requirement  | Description                                                                                                                                                                                                                               |
| ------------------------------------------------------------------------------------------------------- | ------ | ------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Any option of [`light.turn_on`](https://www.home-assistant.io/integrations/light/#service-lightturn_on) | any    | **Optional** | When you click on a color, the card will call the service [`light.turn_on`](https://www.home-assistant.io/integrations/light/#service-lightturn_on) with all the options you put here, such as `rgb_color`, `brightness`, `transition`. [`Click here for the full list of options.`](https://www.home-assistant.io/integrations/light/#service-lightturn_on) |
| icon_color                                                                                              | string | **Optional** | Override icon color. Check out examples below                                                                                                                                                                                             |

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
[hacs-src]: https://flat.badgen.net/badge/HACS/default/orange
[lgtm-src]: https://flat.badgen.net/lgtm/grade/g/bokub/rgb-light-card
[version-href]: https://www.npmjs.com/package/rgb-light-card
[code-style-href]: https://github.com/prettier/prettier
[hacs-href]: https://github.com/custom-components/hacs
[lgtm-href]: https://lgtm.com/projects/g/bokub/rgb-light-card
