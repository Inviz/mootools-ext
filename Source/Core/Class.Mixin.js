/*
---
 
script: Class.Mixin.js
 
description: Classes that can be mixed in and out in runtime.
 
license: MIT-style license.
 
requires:
  - Core/Class

provides: 
  - Class.Mutators.Mixins
  - Class.mixin
  - Class.unmix
 
...
*/

Class.mixin = function(instance, klass, light) {
  var proto = klass.prototype;
  for (var name in proto) !function(value) {
    if (typeof value !== 'function') return;
    switch (name) {
      case "parent": case "initialize": case "uninitialize": case "$constructor":
        return;
    }
    value = value.$origin;
    var origin = instance[name], parent, wrap;
    if (origin) {
      if (light) return;
      if (origin.$mixes) return origin.$mixes.push(value);
      parent = origin.$owner;
      wrap = origin;
      origin = origin.$origin;
    };
    var wrapper = instance[name] = function() {
      var stack = wrapper.$stack;
      if (!stack) stack = wrapper.$stack = Array.prototype.slice.call(wrapper.$mixes, 0);
      var mix = stack.pop();
      wrapper.$owner = {parent: mix ? instance.$constructor : parent}
      if (!mix && !(mix = origin)) return;
      var caller = this.caller, current = this.$caller;
      this.caller = current; this.$caller = wrapper;
      var result = (mix || origin).apply(this, arguments);
      this.$caller = current; this.caller = caller;
      delete wrapper.$stack;
      return result;
    }
    wrapper.$mixes = [value];
    wrapper.$origin = origin;
    wrapper.$name = name;
  }(proto[name]);
  if (proto.initialize) {
    var parent = instance.parent; instance.parent = function(){};
    proto.initialize.call(instance, instance);
    instance.parent = parent;
  }
};

Class.unmix = function(instance, klass, light) {
  var proto = klass.prototype;
  for (var name in proto) !function(value) {
    if (typeof value !== 'function') return;
    var remixed = instance[name]
    if (remixed && remixed.$mixes) {
      if (light) return;
      remixed.$mixes.erase(value.$origin);
      if (!remixed.$mixes.length) {
        if (remixed.$origin) instance[name] = remixed.$origin;
        else delete instance[name];
      }
    }
  }(proto[name]);
  if (proto.uninitialize) {
    var parent = instance.parent; instance.parent = function(){};
    proto.uninitialize.call(instance, instance);
    instance.parent = parent;
  }
};

Class.implement('mixin', function(klass) {
  Class.mixin(this, klass)
});

Class.implement('unmix', function(klass) {
  Class.unmix(this, klass)
});