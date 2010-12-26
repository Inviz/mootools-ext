/*
---
 
script: BorderRadius.js
 
description: Set border radius for all the browsers
 
license: Public domain (http://unlicense.org).
 
requires:
- Core/Element
 
provides: [Element.Properties.borderRadius]
 
...
*/


(function() {
  if (Browser.safari || Browser.chrome) 
    var properties = ['webkitBorderTopLeftRadius', 'webkitBorderTopRightRadius', 'webkitBorderBottomRightRadius', 'webkitBorderBottomLeftRadius'];
  else if (Browser.firefox)
    var properties = ['MozBorderRadiusTopleft', 'MozBorderRadiusTopright', 'MozBorderRadiusBottomright', 'MozBorderRadiusBottomleft']
  else
    var properties = ['borderRadiusTopLeft', 'borderRadiusTopRight', 'borderRadiusBottomRight', 'borderRadiusBottomLeft']
  
  Element.Properties.borderRadius = {

  	set: function(radius){
	    if (radius.each) radius.each(function(value, i) {
	      this.style[properties[i]] = value + 'px';
	    }, this);
  	},

  	get: function(){
	  
    }

  };

})();