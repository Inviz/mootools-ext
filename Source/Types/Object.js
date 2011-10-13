/*
---

name: Object

description: Object with normalized query string serialization

license: MIT-style license.

extends: Core/Object

...
*/

Object.extend({
	toQueryString: function(object, base, index){
		if (typeof object == 'object') {
		  if (object == null) return '';
  		var queryString = [];
		  if (object.push) {
				var complex = false;
				for (var i = 0, j = object.length; i < j; i++) {
				  var item = object[i];
				  if (item != null) 
				    if (typeof item == "object") {
				      complex = true;
				      break;
				    }
				}
		    for (var i = 0; i < j; i++) {
		      var key = base ? base + '[' + (complex ? i : '') + ']' : i;
		      queryString.push(Object.toQueryString(object[i], key))
		    }
		  } else {
		    for (var i in object) {
		      var key = base ? base + '[' + i + ']' : i;
		      queryString.push(Object.toQueryString(object[i], key))
		    }
		  }
  		return queryString.join('&');
		} else {
		  return base + '=' + encodeURIComponent(object);
		}
	}
});