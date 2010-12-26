var output = function() {
  var text = Array.from(arguments).map(function(i){ return (i != null && i.toString) ? i.toString() : i || ''; }).join('');
  new Element('div', {'text': text }).inject('output', 'bottom');
};

var separator = function () {
  $('output').adopt(new Element('hr'));
};