/*
---
 
script: Data.js
 
description: Set/Read html5 data into/from elements.
 
license: Public domain (http://unlicense.org).
 
requires:
- Core/Element
 
provides: [Element.Properties.data]
 
...
*/

Element.Properties.data = {
	get: function(key){
	  key = key.replace(/_/g, '-');
		return this.getProperty('data-' + key);
	},
	
	set: function(key, value) {
	  key = key.replace(/_/g, '-');
	  if (value) {
	    return this.setProperty('data-' + key, value);
	  } else {
	    return this.removeProperty('data-' + key);
	  }
	}
};