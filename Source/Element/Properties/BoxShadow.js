/*
---
 
script: BoxShadow.js
 
description: Set box shadow in an accessible way
 
license: Public domain (http://unlicense.org).
 
requires:
- Core/Element
 
provides: [Element.Properties.boxShadow]
 
...
*/
(function() {
  if (Browser.safari)            var property = 'webkitBoxShadow';
  else if (Browser.Engine.gecko) var property = 'MozBoxShadow'
  else                           var property = 'boxShadow';
  if (property) {
    var dummy = document.createElement('div');
    var cc = property.hyphenate();
    if (cc.charAt(0) == 'w') cc = '-' + cc;
    dummy.style.cssText = cc + ': 1px 1px 1px #ccc'
    Browser.Features.boxShadow = !!dummy.style[property];
    delete dummy;
  }  
  Element.Properties.boxShadow = {
    set: function(value) {
      if (!property) return;
      switch ($type(value)) {
        case "number": 
          value = {blur: value};
          break;
        case "array":
          value = {
            color: value[0],
            blur: value[1],
            x: value[2],
            y: value[3]
          }
          break;
        case "boolean":
          if (value) value = {blur: 10};
          else value = false
        case "object":
         if (value.isColor) value = {color: value}
      }
      if (!value) {
        if (!this.retrieve('shadow:value')) return;
        this.eliminate('shadow:value');
        this.style[property] = 'none';
        return;
      }
      this.store('shadow:value', value)
      var color = value.color ? value.color.toString() : 'transparent'
      this.style[property] = (value.x || 0) + 'px ' + (value.y || 0) + 'px ' + (value.blur || 0) + 'px ' + color;
    }
  }
})();