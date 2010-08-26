/*
---
 
script: Data.js
 
description: Set javascript controller into element
 
license: MIT-style license.
 
requires:
- Core/Element
 
provides: [Element.Properties.widget]
 
...
*/

Element.Properties.widget = {
	get: function(options) {
		return this.set('widget', options);
	},
	
	set: function(options) {
		if (this.retrieve('widget')) {
			return this.retrieve('widget').setOptions(options)
		} else {
			var given = this.retrieve('widget:options') || {};
			for (var i in options) {
				if (given[i] && i.match('^on[A-Z]')) {
					given[i] = (function(a,b) {
						return function() {
							a.apply(this, arguments);
							b.apply(this, arguments);
						}
					})(given[i], options[i])
				} else {
					var o = {};
					o[i] = options[i];
					$extend(given, o);
				}
			}
			this.store('widget:options', given);
		}
	}
};