/*
---
 
script: Element.onDispose.js
 
description: Fires event when element is destroyed
 
license: MIT-style license.

extends: Core/Element
 
...
*/

!function(dispose) { 
  Element.implement({
    dispose: function() {
      if (this.fireEvent) this.fireEvent('dispose', this.parentNode);
  		return (this.parentNode) ? this.parentNode.removeChild(this) : this;
    },
    
    replaces: function(el) {
      el = document.id(el, true);
      var parent = el.parentNode;
  		parent.replaceChild(this, el);
      if (el.fireEvent) el.fireEvent('dispose', parent);
  		return this;
    }
  });
  Element.dispose = function(element) {
    return Element.prototype.dispose.call(element);
  }
  Element.replaces = function(element, el) {
    return Element.prototype.dispose.call(element, el);
  }
}(Element.prototype.dispose, Element.prototype.replaces);