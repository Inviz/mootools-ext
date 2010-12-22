/*
---
 
script: Class.Includes.js
 
description: Multiple inheritance in mootools, chained Extend basically.
 
license: MIT-style license.
 
requires:
- Core/Options
- Core/Events
- Core/Class

provides: [Class.Mutators.Includes, Class.include, Class.flatten]
 
...
*/

(function() {
  
  var getInstance = function(klass){
    klass.$prototyping = true;
    var proto = new klass;
    delete klass.$prototyping;
    return proto;
  };
  
  Class.include = function(klass, klasses) {
    return new Class({
      Includes: Array.from(arguments).flatten()
    });
  };
  
  Class.flatten = function(items) {
    return Array.from(items).clean().map(function(item, i) {
      if (item.parent) {
        return [Class.flatten(item.parent), item];
      } else {
        return item;
      }
    }).flatten();
  };

  Class.Mutators.Includes = function(items) {
    var instance = this.parent ? this.parent : items.shift();
    Class.flatten(items).each(function(parent){
      var baked = new Class;
      if (instance) {
        baked.parent = instance;
        baked.prototype = getInstance(instance);
      }
      var proto = Object.append({}, parent.prototype);
      delete proto.$caller;
      delete proto.$constructor;
      delete proto.parent;
      delete proto.caller;
      for (var i in proto) {
        var fn = proto[i];
        if (fn && fn.$owner && (fn.$owner != parent) && fn.$owner.parent) delete proto[i];
      }
      baked.implement(proto);
      instance = baked;
    }, this);
    this.parent = instance;
    this.prototype = getInstance(instance);
  };
})();