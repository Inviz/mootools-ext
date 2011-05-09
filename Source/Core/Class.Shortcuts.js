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
    
    addShortcut: function(shortcut, fn) {
      var shortcuts = this.shortcuts;
      if (!shortcuts) this.shortcuts = shortcuts = {}
      var group = shortcuts[shortcut];
      if (!group) shortcuts[shortcut] = group = []
      group.push(fn);
      if (this.shortcutting) 
        for (var i = 0, parsed = parse(shortcut), event; event = parsed[i++];)
          this.addEvent(event, fn)
    },
    
    removeShortcut: function(shortcut, fn) {
      var shortcuts = this.shortcuts;
      if (!shortcuts) return;
      var group = shortcuts[shortcut];
      if (!group) return;
      group.push(fn);
      if (this.shortcutting) 
        for (var i = 0, parsed = parse(shortcut), event; event = parsed[i++];)
          this.removeEvent(event, fn)
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
      for (var name in this.shortcuts)
        for (var i = 0, parsed = parse(name), group = this.shortcuts[name], event; event = parsed[i++];)
          for (var j = 0, fn; fn = group[j++];) this.addEvent(event, fn);
    },

    disableShortcuts: function() {
      if (!this.shortcutting) return;
      this.shortcutting = false;
      this.getKeyListener().removeEvent('keypress', this.shortcutter);
      for (var name in this.shortcuts)
        for (var i = 0, parsed = parse(name), group = this.shortcuts[name], event; event = parsed[i++];)
          for (var j = 0, fn; fn = group[j++];) this.removeEvent(event, fn);
    }
  });
  
}();
