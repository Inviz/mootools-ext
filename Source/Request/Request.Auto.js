/*
---

name: Request.Auto

description: Accepts both json and html as response

license: MIT-style license.

requires: 
  - Core/Request.JSON
  - Core/Request.HTML

provides: 
  - Request.Auto
...
*/

Request.Auto = new Class({
  
	Extends: Request,
	
	options: {
	  headers: {
			Accept: 'application/json, text/html'
		}
	},
	
	success: function() {
	  var type = this.getContentType().indexOf('json') > -1 ? 'JSON' : 'HTML';
	  return Request[type].prototype.success.apply(this, arguments);
	},
	
	getContentType: function() {
	  return this.getHeader('Content-Type') ? this.getHeader('Content-Type').split(';')[0] : null;
	}
})
