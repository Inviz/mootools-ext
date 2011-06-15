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
    var enabler = this[state.enabler], disabler = this[state.disabler], toggler = this[state.toggler];
    this[state.enabler] = function() {
      return this.setStateTo(name, true, state, arguments, enabler)
    }
    this[state.disabler] = function() {
      return this.setStateTo(name, false, state, arguments, disabler)
    }
    this[state.toggler] = function() { 
      return this.setStateTo(name, !this[state && state.property || name], state, arguments, toggler)
    }
    if (state.initial || this[state && state.property || name]) this[state.enabler]();
  },

  removeState: function(name, state) {
    if (!state) state = States.get(state);
    delete this.$states[name];
  },
  
  linkState: function(object, from, to, state) {
    var first = this.$states[from] || States.get(from);
    var second = object.$states[to] || States.get(to);
    var events = (first.events || first), method = (state === false ? 'removeEvent' : 'addEvent');
    var enabler = second.enabler, disabler = second.disabler;
    if (enabler.indexOf) enabler = (object.bindEvent ? object.bindEvent(enabler) : object[enabler].bind(object));
    if (disabler.indexOf) disabler = (object.bindEvent ? object.bindEvent(disabler) : object[disabler].bind(object));
    this[method](events.enabler, enabler);
    this[method](events.disabler, disabler);
    if (this[first.property || from]) object[second.enabler]();
  },
  
  unlinkState: function(object, from, to) {
    return this.linkState(object, from, to, false)
  },
  
  setStateTo: function(name, value, state, args, callback) {
    if (!state || state === true) state = States.get(name);
    if (this[state && state.property || name] == value) return false;
    this[state && state.property || name] = !!value;
    if (callback) {
      var result = callback.apply(this, args);
      if (result === false) return false;
    }
    this.fireEvent((state.events || state)[value ? 'enabler' : 'disabler'], result || args);
    if (this.onStateChange && (state.reflect !== false)) this.onStateChange(name, value, result || args);
    return true;
  }
});

States.get = function() {
  return;
};