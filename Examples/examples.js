var output = function (content) {
  $('output').adopt(new Element('div', {'html': content}));
};

var seporator = function () {
  $('output').adopt(new Element('hr'));
};