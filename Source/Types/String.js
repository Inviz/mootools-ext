/*
---

script: String.js

name: String

description: Normalized query string methods with array empty index support

license: MIT-style license

extends: More/String.QueryString

...
*/

String.implement({
	parseQueryString: function(decodeKeys, decodeValues){
		var object = {};
		for (var pair, bits, pairs = this.split('&'), i = 0, j = pairs.length; i < j; i++) {
			pair = pairs[i].split('=');
			var name = pair[0], value = pair[1];
			if (decodeValues !== false && value != null) value = decodeURIComponent(value);
			if (decodeKeys !== false) name = decodeURIComponent(name);
			var keys = name.match(/([^\]\[]+|(\B)(?=\]))/g);
			for (var key, bit, path = object, k = 0, l = keys.length; (key = keys[k]) || k < l; k++) {
				if (k == l - 1) key ? (path[key] = value) : path.push(value);
				else path = (path[key] || (path[key] = path[key] = (keys[k + 1] == "") ? [] : {}))
			}
		}
  	return object;
	}
});