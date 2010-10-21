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
  },
  actions: function(mixin) {
    this.prototype.actions = $mixin(this.prototype.actions || {}, mixin)
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
    return callback.apply(this, arguments) !== false;
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

Macro.map = function(name) {
  return function(item) {
    return item[name]
  }
}

Macro.proc = function(name, args) {
  return function(item) {
    return item[name].apply(item, args || arguments);
  } 
}

Macro.delegate = function(name, method) {
  return function() {
    if (this[name]) return this[name][method].apply(this[name], arguments);
  }
}