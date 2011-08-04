/*
---
 
script: Class.States.js
 
description: A mutator that adds some basic state definition capabilities.
 
license: MIT-style license.
 
requires:
  - Core/Options
  - Core/Events
  - Core/Class
  - Core/Class.Extras

provides: 
  - States
 
...
*/


var States = new Class({
  addStates: function(states) {
    for (var i = 0, j = arguments.length, arg; i < j; i++) {
      arg = arguments[i];
      if (arg.indexOf) this.addState(arg);
      else for (var name in arg) this.addState(name, arg[name]);
    }
  },
  
  removeStates: function(states) {
    for (var i = 0, j = arguments.length, arg; i < j; i++) {
      arg = arguments[i];
      if (arg.indexOf) this.removeState(arg);
      else for (var name in arg) this.removeState(name, arg[name]);
    }
  },
  
  addState: function(name, state) {
    if (!state || state === true) state = States.get(name);
    if (!this.$states) this.$states = {};
    if (this.$states[name]) return;
    this.$states[name] = state;
    var prop = state && state.property || name;
    var enabler = this[state.enabler], disabler = this[state.disabler]
    this[state.enabler] = function() {
      return this.setStateTo(name, true, arguments, enabler, state)
    }
    if (enabler) this[state.enabler].$overloaded = enabler;
    this[state.disabler] = function() {
      return this.setStateTo(name, false, arguments, disabler, state)
    }
    if (disabler) this[state.disabler].$overloaded = disabler;
    if (state.toggler) {
      this[state.toggler] = function() { 
        return this.setStateTo(name, !this[prop], arguments, this[prop] ? disabler : enabler, state)
      }
    }
    if (state.initial || this[prop]) this[state.enabler]();
    if (this.fireEvent) this.fireEvent('stateAdded', [name, state, prop])
  },

  removeState: function(name, state) {
    if (!state || state === true) state = States.get(name);
    var method = this[state.enabler];
    if (method.$overloaded) this[state.enabler] = method.$overloaded
    else delete this[state.enabler];
    method = this[state.disabler];
    if (method.$overloaded) this[state.disabler] = method.$overloaded
    else delete this[state.disabler];
    var prop = state && state.property || name;
    if (this.fireEvent) this.fireEvent('stateRemoved', [name, state, prop])
    if (this[prop]) delete this[prop];
    delete this.$states[name];
  },
  
  unlinkState: function(object, from, to) {
    return this.linkState(object, from, to, false)
  },
  
  setStateTo: function(name, value, args, callback, state) {
    if (!state || state === true) state = States.get(name);
    if (this[state && state.property || name] == value) return false;
    this[state && state.property || name] = !!value;
    if (callback) {
      var result = callback.apply(this, args);
      if (result === false) return false;
    }
    this.fireEvent((state.events || state)[value ? 'enabler' : 'disabler'], result || args);
    if (this.onStateChange && (state.reflect !== false)) 
      this.onStateChange(name, value, result || args, callback);
    return true;
  }
});

States.get = function() {
  return this.$states[name];
};