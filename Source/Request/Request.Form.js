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
        Hash.each(thing, function(value, key) {
          html.push(convert(value, prefix ? (prefix + '[' + key + ']') : key));
        });
        break;
      case "array":
        for (var key = 0; key < thing.length; key++) html.push(convert(thing[key], prefix + '[]'));
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
      options = $merge(this.options, options)
      var data = this.getData(options.data);
      if (data.indexOf) {
        var fragments = options.url.split('#');
        var bits = fragments[0].split('?');
        var params = '?' + (bits[1] || '');
        options.url = bits[0] + '?' + Object.toQueryString(params.parseQueryString(), data.parseQueryString());
        if (fragments[1]) options.url += "#" + fragments[1];
        data = null
      }

      if (options.method != "get" && options.method != "post") {
        data._method = options.method
        options.method = "post"
      }
      if (data) options.data = data;
      else delete options.data;
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
      if (options.method == 'get') {
        location.href = options.url;
      } else this.getForm(options).submit();
    }
  })
})();