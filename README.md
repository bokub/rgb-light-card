# rgb-light-card
A Lovelace custom card for RGB lights


## Installation

#### 1. Open the Raw Config Editor

Go to your Lovelace view

Click on the three dots menu (top-right) and click on _Configure UI_.

Click in the three dots menu again and click on _Raw config editor_.

#### 2. Add the rbg-light-card to the resources

Add the following resource on top of the file :

```yaml
resources:
  - url: https://cdn.jsdelivr.net/gh/bokub/rgb-light-card/card.js
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

| Name | Type | Requirement | Description
| ---- | ---- | ------- | ----------- | 
| type | string | **Required** | `custom:rgb-light-card`
| name | string | **Required** | Light entity to control
| colors | array | **Required** | Colors to display. See options below


### Colors options

| Name | Type | Requirement | Description
| ---- | ---- | ------- | ----------- | 
| Any option of [`light.turn_on`](https://www.home-assistant.io/integrations/light/#service-lightturn_on) | any | **Optional** | When you click on a color, the card will call the service [`light.turn_on`](https://www.home-assistant.io/integrations/light/#service-lightturn_on) with all the options you put here, such as `rgb_color`, `brightness`, `transition`...
| icon_color | string | **Optional** | Override icon color. Check out examples below
