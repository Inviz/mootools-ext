var output = function (content) {
  $('output').adopt(new Element('div', {'html': content}));
};

var separator = function () {
  $('output').adopt(new Element('hr'));
};