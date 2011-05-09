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
    items = Array.from(items);
    var instance = this.parent ? this.parent : items.shift();
    Class.flatten(items).each(function(parent){
      var baked = new Class, proto = parent.prototype;
      if (instance) {
        baked.parent = instance;
        baked.prototype = getInstance(instance);
      }
      for (var name in proto) {
        switch (name) {
          case "$caller": case "$constructor": case "parent": case "caller":
            continue;
        }
        var fn = proto[name];
        if (fn && fn.$owner && (fn.$owner != parent) && fn.$owner.parent) continue;
        baked.implement(name, fn);
      }
      instance = baked;
    }, this);
    this.parent = instance;
    this.prototype = getInstance(instance);
  };
})();