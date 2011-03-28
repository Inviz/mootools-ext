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
        if (thing) return ["<input type='hidden' name='", prefix, "' value='", thing.toString().replace(/\"/g, '\\"'), "'/>"].join("");
    }
    return html.join("\n")
  }

  Request.Form = new Class({
  
    Implements: [Options, Events, Chain],
  
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
      options = Object.merge({}, this.options, options)
      options.data = this.getData(options.data);
      if (options.data && options.data.indexOf) options.data = options.data.parseQueryString();
      if (options.method != "get" && options.method != "post") {
        if (!options.data) options.data = {};
        options.data._method = options.method
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
      if (!this.unloader) {
        var self = this;
        var onfocus = function() {
          self.fireEvent('complete');
          window.removeListener(Browser.ie ? 'focusout' : 'blur', onfocus)
        }
        onfocus.delay(10000, this)
        window.addListener(Browser.ie ? 'focusout' : 'blur', onfocus)
      }
      if (options.method == 'get') {
        var url = options.url
        if (options.data) {
          url = url.split("?");
          if (url[1]) Object.append(options.data, url[1].parseQueryString());
          url = url[0] + (Object.getLength(options.data) > 0 ? ("?" + Object.toQueryString(options.data)) : "");
        }
        location.href = url;
      } else this.getForm(options).submit();
      return this;
    }
  })
})();