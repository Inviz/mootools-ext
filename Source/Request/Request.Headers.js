/*
---

name: Request.Headers

description: Headers of response fire events on request

license: MIT-style license.

requires: 
  - Core/Request
  
extends: Core/Request

provides: 
  - Request.Headers

...
*/

(function() {
  
var Headers = Request.Headers = {};

Request.defineHeader = function(header, value) {
  Headers[header] = value || true;
};

Request.prototype.addEvent('complete', function() {
  for (var header in Headers) {
    var value = this.getHeader(header);
    if (value) {
      var args = Array.concat(value, arguments);
      this.fireEvent(header.camelCase(), args);
      var callback = Headers[header];
      if (callback && callback.call) callback.apply(this, args)
    }
  }
});

})();