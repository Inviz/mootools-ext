/*
---
 
script: Element.from.js
 
description: Methods to create elements from strings
 
license: MIT-style license.

credits: 
  - http://jdbartlett.github.com/innershiv
 
extends: Core/Element

*/

Document.implement('id', (function(){

	var types = {

		string: function(id, nocash, doc){
			id = Slick.find(doc, '#' + id.replace(/(\W)/g, '\\$1'));
			return (id) ? types.element(id, nocash) : null;
		},

		element: function(el, nocash){
			$uid(el);
			if (!nocash && !el.$family && !(/^(?:object|embed)$/i).test(el.tagName)){
				Object.append(el, Element.Prototype);
			}
			return el;
		}

	};

	types.textnode = types.whitespace = types.window = types.document = function(zero){
		return zero;
	};

	return function(el, nocash, doc){
		if (el && el.$family && el.uid) return el;
		if (el && el.toElement) return types.element(el.toElement(doc), nocash);
		var type = typeOf(el);
		return (types[type]) ? types[type](el, nocash, doc || document) : null;
	};

})());