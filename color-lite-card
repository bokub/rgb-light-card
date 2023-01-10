// COLOR LITE CARD

// Simple custom card for displaying lights on a picture elements floor plan


class ColorLite extends HTMLElement {
  set hass(hass) {
    if (!this.content) {
      const card = document.createElement('ha-card');
      this.content = document.createElement('div');
      card.appendChild(this.content);
	  card.style.background = 'none';
	  card.style.border = 'none';
      this.appendChild(card);
    }

    const entityId = this.config.entity;
	const state = hass.states[entityId];

 
//  if the light is on
if(state){
	if(state.state == 'on'){

		const imageURLId = this.config.image;
		var ImURL = imageURLId;
		const imageURLCId = this.config.color_image;
		var rgbval = state.attributes.rgb_color;
		var hsval = state.attributes.hs_color;
		var ctemp = state.attributes.color_temp;
		var hsar = "";
		var min_bright = (this.config.min_brightness * 2.5);
		var bright = state.attributes.brightness;

		if (hsval) {
			if (ctemp || rgbval == "255,255,255") {
			} else {
				var hsar = ' hue-rotate(' + hsval[0] + 'deg)';
				if (imageURLCId) {
				ImURL = imageURLCId;
				}
			}
		}
		var bbritef = bright;
		if (min_bright > bright) {
			bbritef = min_bright;
		}
		var bbrite = (bbritef / 205);
	
		this.content.innerHTML = `
<!-- Custom Lite Card 6  -->	
<img src="${ImURL}" style="filter: opacity(${bbrite})${hsar}!important;" width="100%" height="100%">
`;

	} else {
		this.content.innerHTML = `
	<!-- Custom Lite Card for ${entityId} is turned off -->
	`;
	}
  }
}


  setConfig(config) {
    if (!config.entity) {
      throw new Error('You need to define an entity');
    }
    this.config = config;
  }


  getCardSize() {
    return 3;
  }
}

customElements.define('color-lite-card', ColorLite);
