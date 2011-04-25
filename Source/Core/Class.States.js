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
- Class.Mutators.Includes

provides: 
  - Class.Mutators.States
  - Class.Stateful
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
    this[state.enabler] = (function(callback) { 
      return function() {
        return this.setStateTo(name, true, state, arguments, callback)
      }
    })(this[state.enabler]);
    this[state.disabler] = (function(callback) { 
      return function() {
        return this.setStateTo(name, false, state, arguments, callback)
      }
    })(this[state.disabler])
    if (state.toggler) this[state.toggler] = (function(callback) { 
      return function() {
        return this.setStateTo(name, !this[state.property || name], state, arguments, callback)
      }
    })(this[state.toggler])
  },

  removeState: function(name, state) {
    if (!state) state = States.get(state);
    delete this.$states[name];
  },
  
  linkState: function(object, from, to, state) {
    var first = this.$states[from] || States.get(from);
    var second = object.$states[to] || States.get(to);
    var events = {};
    events[first.enabler] = second.enabler;
    events[first.disabler] = second.disabler;
    this[state === false ? 'removeEvents' : 'addEvents'](object.bindEvents(events));
    if (this[first.property || from]) object[second.enabler]();
  },
  
  unlinkState: function(object, from, to) {
    return this.linkState(object, from, to, false)
  },
  
  setStateTo: function(name, value, state, args, callback) {
    if (!state || state === true) state = States.get(name);
    if (this[state.property || name] == value) return false;
    this[state.property || name] = !!value;
    if (callback) callback.apply(this, args);
    this.fireEvent(state[value ? 'enabler' : 'disabler'], args);
    if (this.onStateChange && (state.reflect !== false)) this.onStateChange(name, value, args);
    return true;
  }
});

States.get = function() {
  return;
};