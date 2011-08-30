/*
---

name: Request.Statuses

description: Statuses fire events on request. Also passes arguments to callChain

license: MIT-style license.

references:
  - http://en.wikipedia.org/wiki/List_of_HTTP_status_codes

requires: 
  - Core/Request
  
extends: Core/Request

provides: 
  - Request.Statuses

...
*/

/* 
  This is a hack to parse response to failure
  event handlers. Mootools doesnt do this. 
  
  This monkey patch ensures your json is
  parsed (and html applied) even if the status 
  is "non successful" (anything but 2xx).
  
*/
(function(onSuccess) {

var Statuses = Request.Statuses = {
  200: 'Ok',
  201: 'Created',
  202: 'Accepted',
  204: 'NoContent',
  205: 'ResetContent',
  206: 'PartialContent',

  300: 'MultipleChoices',
  301: 'MovedPermantently',
  302: 'Found',
  303: 'SeeOther',
  304: 'NotModified',
  307: 'TemporaryRedirect',

  400: "BadRequest",
  401: "Unathorized",
  402: "PaymentRequired",
  403: "Forbidden",
  404: "NotFound",
  405: "MethodNotAllowed",
  406: "NotAcceptable",
  409: "Conflict",
  410: "Gone",
  411: "LengthRequired",
  412: "PreconditionFailed",
  413: "RequestEntityTooLarge",
  414: "RequestURITooLong",
  415: "UnsupportedMediaType",
  416: "RequestRangeNotSatisfiable",
  417: "ExpectationFailed",
  422: "UnacceptableEntity",

  500: "InternalServerError",
  501: "NotImplemented",
  502: "BadGateway",
  503: "ServiceUnvailable",
  504: "GatewayTimeout",
  505: "VariantAlsoNegotiates",
  507: "InsufficientStorage",
  509: "BandwidthLimitExceeded",
  510: "NotExtended"
};
    
Object.merge(Request.prototype, {  
  options: {
    isSuccess: function() {
      return true;
    }
  },
  
  onSuccess: function() {
    if (this.isSuccess()) this.fireEvent('complete', arguments).fireEvent('success', arguments).callChain.apply(this, arguments);
    else this.onFailure.apply(this, arguments);
    var status = Request.Statuses[this.status];
    if (status) this.fireEvent('on' + status, arguments)
  },

  onFailure: function(){
    this.fireEvent('complete', arguments).fireEvent('failure', arguments);
  }
});
  
})(Request.prototype.onSuccess);