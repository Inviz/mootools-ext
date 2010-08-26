/*
---
 
script: Element.Selection.js
 
description: Methods to toggle selectability on element
 
license: MIT-style license.
 
requires:
- Core/Element
 
provides: [Element.disableSelection, Element.enableSelection]
 
...
*/

Element.implement({
  disableSelection: function() {
    if (Browser.Engine.trident) {
      if (!this.retrieve('events:selectstart')) this.store('events:selectstart', $lambda(false));
      this.addEvent('selectstart', this.retrieve('events:selectstart'));
    } else if (Browser.Engine.webkit){
      this.style.WebkitUserSelect = "none";
    } else {
      this.style.MozUserSelect = "none";
    }
    return this;
  },
  
  enableSelection: function() {
    if (Browser.Engine.trident) {
      this.removeEvent('selectstart', this.retrieve('events:selectstart'));
    } else if (Browser.Engine.webkit){
      this.style.WebkitUserSelect = "";
    } else {
      this.style.MozUserSelect = "";
    }
    return this;
  }
});


