/*
---
 
script: Object.Array.js
 
description: Array with fast lookup (based on object)
 
license: MIT-style license.
 
requires:
- Core/Class
 
provides: [Object.Array]
 
...
*/

Object.Array = function() {
  this.push.apply(this, arguments);
}

Array.fast = Array.object = function() {
  var object = {};
  for (var i = 0, arg; arg = arguments[i++];) object[arg] = true;
  return object;
};
Object.Array.prototype = {
  push: function() {
    for (var i = 0, j = arguments.length; i < j; i++)
      this[arguments[i]] = true;
  },

  contains: function(argument) {
    return this[argument];
  },
  
  concat: function(array) {
    if ('length' in array) this.push.apply(this, array);
    else for (var key in array) if (array.hasOwnProperty(key)) this[key] = true;
    return this;
  },
  
  each: function(callback, bound) {
    for (var key in this) {
      if (this.hasOwnProperty(key)) callback.call(bound || this, key, this[key]);
    }
  },

  include: function(value, value) {
    this[value] = true;
  },

  erase: function(value) {
    delete this[value];
  },
  
  join: function(delimeter) {
    var bits = [];
    for (var key in this) if (this.hasOwnProperty(key)) bits.push(key);
    return bits.join(delimeter)
  },
  
  toObject: function() {
    var object = {};
    for (var key in this) if (this.hasOwnProperty(key)) object[key] = this[key];
    return object;
  }
};