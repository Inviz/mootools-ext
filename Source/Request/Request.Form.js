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
      emulation: true,
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
      return (data && data.toQueryString) ? data.toQueryString().parseQueryString() : data;
    },
    
    getOptions: function(options) {
      options = Object.merge({}, this.options, options)
      var data = this.getData(options.data, options);
      if (this.options.emulation && !['get', 'post'].contains(options.method)) {
        if (!data) data = {};
        data._method = options.method
        options.method = "post"
      }
      if (data) options.data = data;
      return options;
    },
  
    getForm: function(options, attrs) {
      var form = document.createElement('form');
      form.setAttribute('method', options.method);
      form.setAttribute('action', options.url);
      form.innerHTML = convert(options.data);
      document.body.appendChild(form);
      return form;
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
          url = url[0] + (url.length > 1 || Object.getLength(options.data) > 0 ? ("?" + Object.toQueryString(options.data)) : "");
        }
        location.href = url;
      } else this.getForm(options).submit();
      return this;
    }
  })
})();