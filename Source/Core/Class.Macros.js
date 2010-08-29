/*
---
 
script: Class.Macros.js
 
description: A few functions that simplify definition of everyday methods with common logic
 
license: MIT-style license.
 
requires:
- Core/Options
- Core/Events
- Core/Class.Extras

provides: [Class.Mutators.States, Macro, Class.hasParent]
 
...
*/



$extend(Class.Mutators, {
  events: function(mixin) {
    this.prototype.events = $mixin(this.prototype.events || {}, mixin);
  },
  shortcuts: function(mixin) {
    this.prototype.shortcuts = $mixin(this.prototype.shortcuts || {}, mixin);
  },
  layered: function(mixin) {
    this.prototype.layered = $mixin(this.prototype.layered || {}, mixin)
  }
});

Class.hasParent = function(klass) {
  var caller = klass.$caller;
  return !!(caller.$owner.parent && caller.$owner.parent.prototype[caller.$name]);
};



Macro = {};
Macro.onion = function(callback) {
  return function() {
    if (!this.parent.apply(this, arguments)) return;
    callback.apply(this, arguments);
    return true;
  } 
}

Macro.setter = function(name, callback) {
  return function() {
    if (!this[name]) this[name] = callback.apply(this, arguments);
    return this[name];
  } 
}

Macro.defaults = function(callback) {
  return function() {
    if (Class.hasParent(this)) {
      return this.parent.apply(this, arguments);
    } else {
      return callback.apply(this, arguments);
    }
  }
};