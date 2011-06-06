/*
---

name: Object

description: Object with normalized query string serialization

license: MIT-style license.

extends: Core/Object

...
*/

Object.extend({
	toQueryString: function(object, base){
		var queryString = [];
		var serialize = function(value, key, multiple){
			if (base) key = base + '[' + key + ']';
			if (multiple == true) key += '[]';
			var result;
			switch (typeOf(value)){
				case 'object': result = Object.toQueryString(value, key); break;
				case 'array':
					for (var i = 0, j = value.length; i < j; i++) serialize(value[i], key, true);
				break;
				default: result = key + '=' + encodeURIComponent(value);
			}
			if (value != null && result != null) queryString.push(result);
		};
		Object.each(object, serialize);
		return queryString.join('&');
	}
});