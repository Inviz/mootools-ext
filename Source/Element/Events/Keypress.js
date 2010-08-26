/*
---
 
script: Keypress.js
 
description: A wrapper to cross-browser keypress keyboard event implementation.
 
license: MIT-style license.
 
requires:
- Core/Element.Event
- Core/Event
- Event.KeyNames
 
provides: [Element.Events.outerClick]
 
...
*/

(function() {
	Element.Events.keypress = {
		base: 'keydown',
		
		onAdd: function(fn) {
			if (!this.retrieve('keypress:listeners')) {
				var events = {
					keypress: function(e) {
					  console.log('real keypress');
						var event = new Event(e)//$extend({}, e);
						event.repeat = (event.code == this.retrieve('keypress:code'));
						event.code = this.retrieve('keypress:code');
						event.key = this.retrieve('keypress:key');
						event.type = 'keypress';
						event.from = 'keypress';
            this.fireEvent('keypress', event)
					}.bind(this),
					keyup: function() {
					  console.log('real keyup');
						this.eliminate('keypress:code');
						this.eliminate('keypress:key');
					}
				}
				this.store('keypress:listeners', events);
				for (var type in events) this.addListener(type, events[type]);
			}
		},
		
		onRemove: function() {
			var events = this.retrieve('keypress:listeners');
			for (var type in events) this.removeListener(type, events[type]);
			this.eliminate('keypress:listeners');
		},
		
		condition: function(event) {
		  event.repeat = (event.key == this.retrieve('keypress:key'));
			this.store('keypress:code', event.code);
		  this.store('keypress:key', event.key);
			if (event.firesKeyPressEvent(this.retrieve('keypress:code'))) {
				event.pressed = true;
				event.stopPropagation();
				console.log(event.type, 'keydown!')
				return true;
			} else {  
				event.type = 'keypress';
				event.from = 'keypress';
			  return true;
			}
		}
	};
})();