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

Class.mixin = function(instance, klass) {
  var proto = klass.prototype;
  Object.each(proto, function(value, name) {
    if (typeof value !== 'function') return;
    switch (name) {
      case "parent": case "initialize": case "uninitialize": case "$constructor":
        return;
    }
    value = value.$origin;
    var origin = instance[name], parent, wrap
    if (origin) {
      if (origin.$mixes) return origin.$mixes.push(value);
      parent = origin.$owner;
      wrap = origin;
      origin = origin.$origin;
    }  
    var wrapper = instance[name] = function() {
      var stack = wrapper.$stack;
      if (!stack) stack = wrapper.$stack = wrapper.$mixes.clone()
      var mix = stack.pop();
      wrapper.$owner = {parent: mix ? instance.$constructor : parent}
      if (!mix) mix = origin;
      if (!mix) return;
      var caller = this.caller, current = this.$caller;
      this.caller = current; this.$caller = wrapper;
      var result = (mix || origin).apply(this, arguments);
      this.$caller = current; this.caller = caller;
      delete wrapper.$stack;
      return result;
    }.extend({$mixes: [value], $origin: origin, $name: name});
  });
  if (instance.setOptions && proto.options) instance.setOptions(proto.options) //undoeable now :(
  if (proto.initialize) {
    var parent = instance.parent; instance.parent = function(){};
    proto.initialize.call(instance, instance);
    instance.parent = parent;
  }
}

Class.unmix = function(instance, klass) {
  var proto = klass.prototype;
  Object.each(proto, function(value, key) {
    if (typeof value !== 'function') return;
    var remixed = instance[key]
    if (remixed && remixed.$mixes) {
      if (remixed.$origin) instance[key] = remixed.$origin;
      else delete instance[key];
    }
  })
  if (proto.uninitialize) {
    var parent = instance.parent; instance.parent = function(){};
    proto.uninitialize.call(instance, instance);
    instance.parent = parent;
  }
}

Class.implement('mixin', function(klass) {
  Class.mixin(this, klass)
})

Class.implement('unmix', function(klass) {
  Class.unmix(this, klass)
})