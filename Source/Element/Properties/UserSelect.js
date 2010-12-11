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
  if (Browser.Engine.webkit)
    var property = Browser.Engine.version == 525 ? 'WebkitUserSelect' : 'KhtmlUserSelect';
  else if (Browser.Engine.gecko)
    var property = 'MozUserSelect'
  else if (!Browser.Engine.trident)
    var property = 'UserSelect';
    
  Element.Properties.userSelect = {
    set: function(value) {
      if (!property) this.unselectable = value ? 'on' : 'off'
      else this.style[property] = value ? 'inherit' : 'none';
    }
  }
})();