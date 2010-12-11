/*
---
 
script: Class.States.js
 
description: A mutator that adds some basic state definition capabilities.
 
license: MIT-style license.
 
requires:
- Core/Options
- Core/Events
- Core/Class
- Core/Hash
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
      return this[this.options.states[state][to ? 'enabler' : 'disabler']]()
    }
  };

  Hash.each(states, function(methods, state) {
    var options = Array.link(methods, {enabler: String.type, disabler: String.type, toggler: String.type, reflect: $defined})
    //enable reflection by default
    if (!$defined(options.reflect)) options.reflect = true;
    
    proto.options.states[state] = options;

    proto[options.enabler] = function() {
      if (this[state]) return false;
      this[state] = true; 

    	if (Class.hasParent(this)) this.parent.apply(this, arguments);
    	
      this.fireEvent(options.enabler, arguments);
      if (this.onStateChange && options.reflect) this.onStateChange(state, true, arguments);
      return true;
    }

    proto[options.disabler] = function() {
      if (!this[state]) return false;
      this[state] = false;

  	  if (Class.hasParent(this)) this.parent.apply(this, arguments);

      this.fireEvent(options.disabler, arguments);
      if (this.onStateChange && options.reflect) this.onStateChange(state, false, arguments);
      return true;
    }

    if (options.toggler) proto[options.toggler] = function() {
      return this[this[state] ? options.disabler : options.enabler].apply(this, arguments)
    }
  });
  
  return new Class(proto)
}

Class.Mutators.States = function(states) {
  this.implement('Includes', [Class.Stateful(states)]);
};