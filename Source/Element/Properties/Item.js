/*
---
 
script: Item.js
 
description: Methods to get and set microdata closely to html5 spsec
 
license: MIT-style license.
 
requires:
- Core/Element
 
provides: [Element.prototype.getItems, Element.Properties.item, Element.Microdata]
 
...
*/

[Document, Element].invoke('implement', {
  getItems: function(tokens) {
    var selector = '[itemscope]:not([itemprop])';
    if (tokens) selector += tokens.split(' ').map(function(type) {
      return '[itemtype~=' + type + ']'
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
    var property = this.getProperty('itemprop');
    if (property) {
      var value = this.get('itemvalue');
      if (value) push(properties, property, value)
    }
    
    this.getChildren().each(function(child) {
      var values = child.get('properties');
      for (var property in values) push(properties, property, values[property]);
    });
    
    var reference = this.getProperty('itemref');
    if (reference) {
      var selector = reference.split(' ').map(function(id) { return '#' + id}).join(', ');
      $$(selector).each(function(reference) {
        var values = reference.get('properties');
        for (var property in values) push(properties, property, values[property]);
      })
    }
    
    return properties;
  },
  
  set: function(value) {
    this.getChildren().each(function(child) {
      var property = child.getProperty('itemprop');
      if (property) child.set('itemvalue', value[property]);
      else child.set('properties', value)
    });
  }
};

})();

Element.Properties.item = {
  get: function() {
    if (!this.getProperty('itemscope')) return;
    return this.get('properties');
  },
  
  set: function(value) {
    if (!this.getProperty('itemscope')) return;
    return this.set('properties', value);
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
    var item = this.get('item');
    if (item) return item;
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
        if (!(datetime === undefined)) return datetime;
      default:
        return this.getProperty('itemvalue') || this.get('text');
    }        
  },

  set: function(value) {
    var property = this.getProperty('itemprop');
    var scope = this.getProperty('itemscope');
    if (property === undefined) return;
    else if (scope && Object.type(value[scope])) return this.set('item', value[scope]);
    
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