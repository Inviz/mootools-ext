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
  mixing: for (var name in proto) {
    switch (name) {
      case "parent": case "initialize": case "onMix":  case "onUnmix": case "$constructor":
        continue mixing;
    }
    !function(value) {
      if (typeof value !== 'function') return;
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
  }
  if (proto.onMix) return proto.onMix.call(instance);
};

Class.unmix = function(instance, klass, light) {
  var proto = klass.prototype;
  unmixing: for (var name in proto) {
    switch (name) {
      case "parent": case "initialize": case "onMix":  case "onUnmix": case "$constructor":
        continue unmixing;
    }
    var value = proto[name];
    if (typeof value !== 'function') return;
    var remixed = instance[name]
    if (remixed && remixed.$mixes) {
      var index = remixed.$mixes.indexOf(value.$origin);
      if (index == -1) return;
      remixed.$mixes.splice(index, 1);
      if (!remixed.$mixes.length) {
        if (remixed.$origin) instance[name] = remixed.$origin;
        else delete instance[name];
      }
    }
  }
  if (proto.uninitialize) {
    var parent = instance.parent; instance.parent = function(){};
    proto.uninitialize.call(instance, instance);
    instance.parent = parent;
  }
  if (proto.onUnmix) return proto.onUnmix.call(instance);
};

Class.implement('mixin', function(klass) {
  Class.mixin(this, klass)
});

Class.implement('unmix', function(klass) {
  Class.unmix(this, klass)
});