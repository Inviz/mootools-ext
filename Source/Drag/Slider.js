/*
---
 
script: Slider.js
 
description: Methods to update slider without reinitializing the thing
 
license: MIT-style license.
 
requires:
- Drag.Limits
- More/Slider

provides: [Slider.prototype.update]
 
...
*/


Slider.implement({
  update: function() {
		var offset = (this.options.mode == 'vertical') ?  'offsetHeight' : 'offsetWidth'
		this.half = this.knob[offset] / 2; 
		this.full =  this.element[offset] - this.knob[offset] + (this.options.offset * 2); 
		
		//this.setRange(this.options.range);

		this.knob.setStyle(this.property, this.toPosition(this.step));
		var X = this.axis.capitalize();
		this.drag['setMin' + X](- this.options.offset)
		this.drag['setMax' + X](this.full - this.options.offset)
  }
})