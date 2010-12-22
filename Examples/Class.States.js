var Chameleon = new Class({
  States: { 'visible': [ 'show', 'hide', 'toggle' ] },
  Implements: Events,
  visible: true,
  initialize: function(){
    output('Chameleon is born');
    this.currentState();
    this.addEvent('hide', function(){
      output('Chameleon hides');
      this.currentState();
    }.bind(this));
  },

  currentState: function(){
    output('current visibility state: ', this.visible);
  }
});

var chameleon = new Chameleon();
chameleon.hide();