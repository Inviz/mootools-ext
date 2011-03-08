/*
---
 
script: Element.from.js
 
description: Methods to create elements from strings
 
license: MIT-style license.

credits: 
  - http://jdbartlett.github.com/innershiv
 
requires:
- Core/Element
 
provides: [Element.from, window.innerShiv, Elements.from, document.createFragment]
 
...
*/

document.createFragment = window.innerShiv = (function() {
	var d, r;
	
	return function(h, u) {
	  console.log(h, u, 123)
		if (!d) {
			d = document.createElement('div');
			r = document.createDocumentFragment();
			/*@cc_on d.style.display = 'none';@*/
		}
		
		var e = d.cloneNode(true);
		/*@cc_on document.body.appendChild(e);@*/
		e.innerHTML = h.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
		/*@cc_on document.body.removeChild(e);@*/
		
		if (u === false) return e.childNodes;
		
		var f = r.cloneNode(true), i = e.childNodes.length;
		while (i--) f.appendChild(e.firstChild);
		
		return f;
	}
}());

Element.from = function(html) {
  new Element(innerShiv(html, false)[0])
};
Elements.from = function(html) {
  new Elements(innerShiv(html))
};