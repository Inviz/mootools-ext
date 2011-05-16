/*
---
 
script: Keypress.js
 
description: A wrapper to cross-browser keypress keyboard event implementation.
 
license: MIT-style license.
 
requires:
  - Core/Element.Event
  - Core/Event

provides: 
  - Element.Events.input
...
*/


Element.Events.input = {
  base: Browser.ie ? 'propertychange' : 'input'
}
Element.NativeEvents['propertychange'] = Element.NativeEvents['input'] = 2;
