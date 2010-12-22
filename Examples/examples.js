var output = function (content) {
  $('output').adopt(new Element('div', {'html': content}));
}