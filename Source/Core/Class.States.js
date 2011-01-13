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
 
...
*/


Class.Stateful = function(states) {
  var proto = {
    options: {
      states: {}
    },
    setStateTo: function(state, to) {
      return this[this.options.states[state][to ? 'enabler' : 'disabler']]();
    }
  };

  Object.each(states, function(methods, state) {
    var options = Array.link(methods, {
      enabler: Type.isString,
      disabler: Type.isString,
      toggler: Type.isString,
      reflect: function(value){ return value != null; }
    });
    
    //enable reflection by default
    if (options.reflect == null) options.reflect = true;

    proto.options.states[state] = options;

    proto[options.enabler] = function() {
      if (this[state]) return false;
      this[state] = true; 
      if (Class.hasParent(this)) this.parent.apply(this, arguments);

      this.fireEvent(options.enabler, arguments);
      if (this.onStateChange && options.reflect) this.onStateChange(state, true, arguments);
      return true;
    };

    proto[options.disabler] = function() {
      if (!this[state]) return false;
      this[state] = false;

  	  if (Class.hasParent(this)) this.parent.apply(this, arguments);

      this.fireEvent(options.disabler, arguments);
      if (this.onStateChange && options.reflect) this.onStateChange(state, false, arguments);
      return true;
    };

    if (options.toggler) proto[options.toggler] = function() {
      return this[this[state] ? options.disabler : options.enabler].apply(this, arguments);
    };
  });

  return new Class(proto);
};

Class.Mutators.States = function(states) {
  this.implement('Includes', Class.Stateful(states));
};
Class.Mutators.Stateful = function(states) {
  this.implement('Implements', Class.Stateful(states));
};