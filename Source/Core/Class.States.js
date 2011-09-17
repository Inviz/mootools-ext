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
  
  addState: function(name, state, quiet) {
    if (!state || state === true) state = States.get(name);
    if (!this.$states) this.$states = {};
    if (this.$states[name]) return;
    this.$states[name] = state;
    var prop = state && state.property || name;
    var enabler = this[state.enabler], disabler = this[state.disabler]
    if (!enabler || !enabler.$overloaded) {
      this[state.enabler] = function() {
        return this.setStateTo(name, true, arguments, enabler, state)
      }
      this[state.enabler].$overloaded = enabler || true;
    }
    if (!disabler || !disabler.$overloaded) {
      this[state.disabler] = function() {
        return this.setStateTo(name, false, arguments, disabler, state)
      }
      this[state.disabler].$overloaded = disabler || true;
    }
    if (state.toggler) {
      this[state.toggler] = function() { 
        return this.setStateTo(name, !this[prop], arguments, this[prop] ? disabler : enabler, state)
      }
    }
    if (quiet !== true && (state.initial || this[prop])) this[state.enabler]();
    if (this.fireEvent) this.fireEvent('stateAdded', [name, state, prop])
  },

  removeState: function(name, state, quiet) {
    var prop = state && state.property || name;
    if (!state || state === true) state = States.get(name);
    if (quiet !== true) if (this[prop]) this[state.disabler]();
    var method = this[state.enabler];
    if (method.$overloaded && method.$overloaded !== true) this[state.enabler] = method.$overloaded
    else delete this[state.enabler];
    method = this[state.disabler];
    if (method.$overloaded && method.$overloaded !== true) this[state.disabler] = method.$overloaded
    else delete this[state.disabler];
    if (this.fireEvent) this.fireEvent('stateRemoved', [name, state, prop])
    delete this[prop];
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
    if (callback !== false) this.fireEvent((state.events || state)[value ? 'enabler' : 'disabler'], result || args);
    if (this.onStateChange && (state.reflect !== false)) 
      this.onStateChange(name, value, result || args, callback);
    return true;
  }
});

States.get = function() {
  return this.$states[name];
};