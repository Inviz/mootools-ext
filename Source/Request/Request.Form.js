/*
---

name: Request.Form

description: Create & submit forms.

license: MIT-style license.

requires: 
  - Core/Request
  - More/String.QueryString

provides: 
  - Request.Form

...
*/


(function() {
  if (!window.Request) Request = {};
  
  var convert = function(thing, prefix) {
    var html = [];
    
    switch (typeOf(thing)) {
      case "object":
        for (var key in thing) html.push(convert(thing[key], prefix ? (prefix + '[' + key + ']') : key));
        break;
      case "array":
        for (var key = 0, length = thing.length; key < length; key++) html.push(convert(thing[key], prefix + '[]'));
        break;
      case "boolean":
        break;
      default:
        return ["<input type='hidden' name='", prefix, "' value='", thing.toString().replace(/\"/g, '\\"'), "'/>"].join("");
    }
    return html.join("\n")
  }

  Request.Form = new Class({
  
    Implements: [Options, Events],
  
    options: {
      url: null,
      method: "get",
      async: false,
			form: null,
			data: null
    },
  
    initialize: function(options) {
      if (!options.data) delete options.data;
      this.setOptions(options)
      return this
    },
    
    getData: function(data) {
      return data;
    },
    
    getOptions: function(options) {
      options = Object.merge(this.options, options)
      options.data = this.getData(options.data);
      if (options.data && options.data.indexOf) options.data = options.data.parseQueryString();
      if (options.method != "get" && options.method != "post") {
        data._method = options.method
        options.method = "post"
      }
      return options;
    },
  
    getForm: function(options, attrs) {
      return (this.options.form || new Element('form', attrs).inject(document.body)).set({
        'method': options.method,
        'action': options.url,
        'html'  : convert(options.data)
      });
    },

    send: function(options) {
      options = this.getOptions(options);
      this.fireEvent('request', options);
      this.getForm(options).submit();
    }
  })
})();