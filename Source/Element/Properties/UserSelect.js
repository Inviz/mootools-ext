/*
---
 
script: UserSelect.js
 
description: Disable user selection cross-browserly by setting userSelect property
 
license: Public domain (http://unlicense.org).
 
requires:
- Core/Element
 
provides: [Element.Properties.userSelect]
 
...
*/

(function() {
  if (Browser.chrome || Browser.safari)
    var property = Browser.version == 525 ? 'WebkitUserSelect' : 'KhtmlUserSelect';
  else if (Browser.firefox)
    var property = 'MozUserSelect'
  else if (!Browser.ie)
    var property = 'UserSelect';
    
  Element.Properties.userSelect = {
    set: function(value) {
      if (!property) this.unselectable = value ? 'on' : 'off'
      else this.style[property] = value ? 'inherit' : 'none';
    }
  }
})();