/*
---
 
script: Class.Shortcuts.js
 
description: A mixin that adds and fiews keyboard shortcuts as events on object.
 
license: MIT-style license.
 
requires:
  - Core/Options
  - Core/Events
  - Core/Class
  - Core/Class.Extras
  - Core/Browser

provides: 
  - Shortcuts
 
...
*/


!function() {
  var parsed = {};
  var modifiers = ['shift', 'control', 'alt', 'meta'];
  var aliases = {
    'ctrl': 'control',
    'command': Browser.Platform.mac ? 'meta': 'control',
    'cmd': Browser.Platform.mac ? 'meta': 'control'
  };
  var presets = {
    'next': ['right', 'down'],
    'previous': ['left', 'up'],
    'ok': ['enter', 'space'],
    'cancel': ['esc']
  };

  var parse = function(expression){
    if (presets[expression]) expression = presets[expression];
    return (expression.push ? expression : [expression]).map(function(type) {
      if (!parsed[type]){
        var bits = [], mods = {}, string, event;
        if (type.contains(':')) {
          string = type.split(':');
          event = string[0];
          string = string[1];
        } else {  
          string = type;
          event = 'keypress';
        }
        string.split('+').each(function(part){
          if (aliases[part]) part = aliases[part];
          if (modifiers.contains(part)) mods[part] = true;
          else bits.push(part);
        });

        modifiers.each(function(mod){
          if (mods[mod]) bits.unshift(mod);
        });

        parsed[type] = event + ':' + bits.join('+');
      }
      return parsed[type];
    });
  };
  
  Shortcuts = new Class({
    
    addShortcuts: function(shortcuts, internal) {
      for (var shortcut in shortcuts) this.addShortcut(shortcut, shortcuts[shortcut], internal);
    },

    removeShortcuts: function(shortcuts, internal) {
      for (var shortcut in shortcuts) this.removeShortcut(shortcut, shortcuts[shortcut], internal);
    },
    
    addShortcut: function(shortcut, fn, internal) {
      parse(shortcut).each(function(cut) {
        this.addEvent(cut, fn, internal)
      }, this)
    },
    
    removeShortcut: function(shortcut, fn, internal) {
      parse(shortcut).each(function(cut) {
        this.removeEvent(cut, fn, internal)
      }, this)
    },
    
    getKeyListener: function() {
      return this.element;
    },

    enableShortcuts: function() {
      if (!this.shortcutter) {
        this.shortcutter = function(event) {
          var bits = [event.key];
          modifiers.each(function(mod){
            if (event[mod]) bits.unshift(mod);
          });
          this.fireEvent(event.type + ':' + bits.join('+'), arguments)
        }.bind(this)
      }
      if (this.shortcutting) return;
      this.shortcutting = true;
      this.getKeyListener().addEvent('keypress', this.shortcutter);
    },

    disableShortcuts: function() {
      if (!this.shortcutting) return;
      this.shortcutting = false;
      this.getKeyListener().removeEvent('keypress', this.shortcutter);
    }
  });
  
}();
