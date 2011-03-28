/*
---
 
script: Element.Destroy.js
 
description: Fires event when element is destroyed
 
license: MIT-style license.

extends: Core/Element
 
...
*/

!function(dispose) { 
  Element.implement('dispose', function() {
    if (this.fireEvent) this.fireEvent('dispose', this.parentNode);
		return (this.parentNode) ? this.parentNode.removeChild(this) : this;
  });
  Element.dispose = function(element) {
    return Element.prototype.dispose.call(element);
  }
}(Element.prototype.dispose);