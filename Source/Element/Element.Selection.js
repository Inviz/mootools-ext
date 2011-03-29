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
    if (Browser.ie) {
      if (!this.retrieve('events:selectstart')) this.store('events:selectstart', function() {
        return false
      });
      this.addEvent('selectstart', this.retrieve('events:selectstart'));
    } else if (Browser.safari || Browser.chrome{
      this.style.WebkitUserSelect = "none";
    } else {
      this.style.MozUserSelect = "none";
    }
    return this;
  },
  
  enableSelection: function() {
    if (Browser.ie) {
      this.removeEvent('selectstart', this.retrieve('events:selectstart'));
    } else if (Browser.safari || Browser.chrome){
      this.style.WebkitUserSelect = "";
    } else {
      this.style.MozUserSelect = "";
    }
    return this;
  }
});


