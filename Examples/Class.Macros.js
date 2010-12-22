var Animal = new Class({
  Includes: [Events],
  States: {
    'burn': ['birth', 'kill', 'toggle']
  },
  
  birth: Macro.onion(function () {
    output('Animal built');
  })
});

var GoodVoice = new Class({  
  birth: Macro.onion(function () {
    output('Good voice');
  }),
  
  say: function() {
    output('mau!!!!');
  }
});

var Cat = new Class({
  Includes: [Animal, GoodVoice],
  
  initialize: function () {
    output('Cat birth');
    this.element = new Element('div');
    this.birth();
  },
  
  options: {
    color: new Color('#000')
  },
  
  getUid: Macro.getter('uid', function () {
    output('generating uid');
    return String.uniqueID();
  }),
  
  say: Macro.defaults(function () {
    output('mau');
  }),
  
  optionsToo: Macro.map('options'),
  
  hide: Macro.delegate('element', 'hide'),
  
  birth: Macro.onion(function () {
    output('Cat living');
  })
});

cat = new Cat();

separator();

output(cat.getUid());
output(cat.getUid());

output(cat.hide());

cat.say();

separator();

var words = "some text is here".split(" ");

output(words.map(Macro.map('length')).join(' '));
output(words.map(Macro.proc('capitalize')).join(' '));