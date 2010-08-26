/*
---
 
script: Logger.js
 
description: Basic logging mixin
 
license: MIT-style license.
 
requires:
- Core/Class

provides: [Logger]
 
...
*/

Logger = new Class({
	log: function() {
		var name = (this.getName ? this.getName() : this.name) + " ::"
		if (console.log && console.log.apply) console.log.apply(console, toArgs([name].concat($A(arguments))));
		return this;	
	}
});