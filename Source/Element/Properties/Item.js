/*
---
 
script: Item.js
 
description: Methods to get and set microdata closely to html5 spsec
 
license: MIT-style license.
 
requires:
- Core/Element
 
provides: [Element.prototype.getItems, Element.Properties.item, Element.Microdata, Element.Item]
 
...
*/
Element.Item = {
  walk: function(element, callback, memo, prefix) {
    var prop = element.getAttribute('itemprop');
    var scope = !!element.getAttribute('itemscope');
    if (prefix && prop) {
      if (!memo) memo = [];
      memo.push(prop);
    }
    for (var i = 0, children = element.childNodes, child; child = children[i++];) {
      if (child.nodeType != 1) continue;
      memo = Element.Item.walk.call(this, child, callback, memo, prefix);
    }
    var reference = element.getAttribute('itemref');
    if (scope && reference) {
      for (var i = 0, bits = reference.split(/\s*/), j = bits.length; i < j; i++) {
        var node = document.getElementById(bits[i]);
        if (node) Element.Item.walk.call(this, child, callback, memo, prefix);
      }
    }
    if (prefix && prop) memo.pop();
    return (prop) ? callback.call(this, element, prop, scope, memo) : memo;
  },
  
  serialize: function(element) {
    return Element.Item.walk(element, function(element, prop, scope, object) {
      if (!object) object = {};
      if (scope) {
        var obj = {};
        obj[prop] = object;
        return obj;
      } else {
        object[prop] = Element.get(element, 'itemvalue');
        return object;
      }
    })
  }
};

[Document, Element].invoke('implement', {
  getItems: function(tokens, strict) {
    var selector = '[itemscope]:not([itemprop])';
    if (tokens) selector += tokens.split(' ').map(function(type) {
      return '[itemtype' + (strict ? '~' : '*') + '=' + type + ']'
    }).join('');
    return this.getElements(selector).each(function(element) {
      return element.get('item');
    }).get('item')
  }
});

(function() {
  var push = function(properties, property, value) {
    var old = properties[property];
    if (old) { //multiple values, convert to array
      if (!old.push) properties[property] = [old];
      properties[property].push(value)
    } else {
      properties[property] = value;
    }
  }

Element.Properties.properties = {
  get: function() {
    var properties = {};
    var property = Element.getProperty(this, 'itemprop'), scope;
    if (property) {
      var scope = Element.getProperty(this, 'itemscope');
      if (!scope) {
        var value = Element.get(this, 'itemvalue');
        if (value) push(properties, property, value);
      }
    }
    for (var i = 0, child; child = this.childNodes[i++];) {
      if (child.nodeType != 1) continue;
      var values = Element.get(child, 'properties');
      for (var prop in values) push(properties, prop, values[prop]);
    }
    
    var reference = Element.getProperty(this, 'itemref');
    if (reference) {
      var selector = reference.split(' ').map(function(id) { return '#' + id}).join(', ');
      var elements = Slick.search(document.body, selector);
      for (var i = 0, reference; reference = elements[i++];) {
        var values = Element.get(reference, 'properties');
        for (var prop in values) push(properties, prop, values[prop]);
      }
    }
    
    if (scope) {
      var props = {};
      props[property] = properties;
      return props;
    }
    return properties;
  },
  
  set: function(value) {
    for (var i = 0, child; child = this.childNodes[i++];) {
      if (child.nodeType != 1) continue;
      var property = Element.getProperty(child, 'itemprop');
      if (property) Element.set(child, 'itemvalue', value[property]);
      else Element.set(child, 'properties', value)
    };
  }
};

})();

Element.Properties.item = {
  get: function() {
    if (!Element.getProperty(this, 'itemscope')) return;
    return Element.get(this, 'properties');
  },
  
  set: function(value) {
    if (!Element.getProperty(this, 'itemscope')) return;
    return Element.set(this, 'properties', value);
  }
};

(function() {

var resolve = function(url) {
  if (!url) return '';
  var img = document.createElement('img');
  img.setAttribute('src', url);
  return img.src;
}

Element.Properties.itemvalue = {
  get: function() {
    var property = this.getProperty('itemprop');
    if (!property) return;
    switch (this.get('tag')) {
      case 'meta':
        return this.get('content') || '';
      case 'input':
      case 'select':
      case 'textarea':
        return this.get('value');
      case 'audio':
      case 'embed':
      case 'iframe':
      case 'img':
      case 'source':
      case 'video':
        return resolve(this.get('src'));
      case 'a':
      case 'area':
      case 'link':
        return resolve(this.get('href'));
      case 'object':
        return resolve(this.get('data'));
      case 'time':
        var datetime = this.get('datetime');
        if (!(datetime === undefined)) return Date.parse(datetime);
      default:
        return this.getProperty('itemvalue') || this.get('text').trim();
    }
  },

  set: function(value) {
    var property = this.getProperty('itemprop');
    var scope = this.getProperty('itemscope');
    if (property === undefined) return;
    else if (scope != null && Object.type(value[property])) return this.set('item', value[property]);
    
    switch (this.get('tag')) {
      case 'meta':
        return this.set('content', value);
      case 'audio':
      case 'embed':
      case 'iframe':
      case 'img':
      case 'source':
      case 'video':
        return this.set('src', value);
      case 'a':
      case 'area':
      case 'link':
        return this.set('href', value);
      case 'object':
        return this.set('data', value);
      case 'time':
        var datetime = this.get('datetime');
        if (!(datetime === undefined)) this.set('datetime', value)
      default:
        return this.set('html', value);
    }
  }
}

})();