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
  for (var name in proto) {
    if (Class.mixin.skip[name]) continue;
    var value = proto[name];
    if (!value || !value.call) continue;
    if (!light || !instance[name]) Class.mixOne(instance, name, value);
  }
  if (proto.onMix) return proto.onMix.call(instance);
};

Class.mixOne = function(instance, name, value) {
  value = value.$origin;
  var origin = instance[name], parent, wrap;
  if (origin) {
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
};

Class.unmix = function(instance, klass, light) {
  var proto = klass.prototype;
  for (var name in proto) {
    if (Class.mixin.skip[name]) continue;
    var value = proto[name];
    if (!value || !value.call) continue;
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
  if (proto.onUnmix) return proto.onUnmix.call(instance);
};

Class.mixin.skip = {
  parent: 1, 
  initialize: 1, 
  onMix: 1, 
  onUnmix: 1, 
  "$constructor": 1, 
  constructors: 1
};

Class.implement('mixin', function(klass) {
  Class.mixin(this, klass)
});

Class.implement('unmix', function(klass) {
  Class.unmix(this, klass)
});