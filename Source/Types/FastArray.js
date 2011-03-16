/*
---
 
script: FastArray.js
 
description: Array with fast lookup (based on object)
 
license: MIT-style license.
 
requires:
- Core/Class
 
provides: [FastArray]
 
...
*/

FastArray = function() {
  this.push.apply(this, arguments);
}

FastArray.from = function(ary) {
  var array = new FastArray;
  FastArray.prototype.push.apply(array, ary)
  return array;
}
FastArray.prototype = {
  push: function() {
    Array.each(arguments, function(argument) {
      this[argument] = true;
    }, this);
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

  include: function(value) {
    this[value] = true;
  },

  erase: function(value) {
    delete this[value];
  },
  
  join: function(delimeter) {
    var bits = [];
    for (var key in this) if (this.hasOwnProperty(key)) bits.push(key);
    return bits.join(delimeter)
  }
};