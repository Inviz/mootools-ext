/*
---
 
script: Data.js
 
description: Get/Set javascript controller into element
 
license: MIT-style license.
 
requires:
- Core/Element
 
provides: [Element.Properties.widget]
 
...
*/

Element.Properties.widget = {
  get: function(){
    var widget, element = this;
    while (element && !(widget = element.retrieve('widget'))) element = element.getParent();
    if (widget && (element != this)) this.store('widget', widget);
    return widget;
  },
	
	set: function(options) {
	  var retrieved = Element.retrieve(this, 'widget');
		if (retrieved) {
			return retrieved.setOptions(options)
		} else {
			var given = Element.retrieve(this, 'widget:options') || {};
			for (var i in options) {
				if (given[i] && i.match('^on[A-Z]')) {
					given[i] = (function(a,b) {        // temp solution (that is 1.5 years in production :( )
						return function() {              // wrap two functions in closure instead of overwrite
							a.apply(this, arguments);      // TODO: some way of passing a raw array of callbacks
							b.apply(this, arguments);
						}
					})(given[i], options[i])
				} else {
					var o = {};
					o[i] = options[i];
					$extend(given, o);
				}
			}
			Element.retrieve(this, 'widget:options', given);
		}
	}
};



