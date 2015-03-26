var fs = require('fs');
var path = require('path');

var _fonts;
function readFonts() {
  if (_fonts === undefined) {
    var fonts_filename = path.join(__dirname, 'fonts');
    var fonts_data = fs.readFileSync(fonts_filename, {encoding: 'ascii'});
    _fonts = {};
    fonts_data.trim().split(/\n/).forEach(function(fonts_line) {
      var fonts_parts = fonts_line.split(/\t/);
      _fonts[fonts_parts[0]] = fonts_parts[1];
    });
  }
  return _fonts;
}

/**
parseCharMetrics(line: string) => {charCode: number, width: number, name: string}
*/
function parseCharMetrics(line) {
  var charCode_match = line.match(/C\s+(\d+|-1)/);
  var width_match = line.match(/WX\s+(\d+)/);
  var name_match = line.match(/N\s+(\w+)/);
  var charCode = charCode_match ? parseInt(charCode_match[1], 10) : null;
  var width = width_match ? parseInt(width_match[1], 10) : null;
  var name = name_match ? name_match[1] : null;
  return {
    charCode: charCode,
    width: width,
    name: name,
  };
}

/**
parseFontMetrics(data: string) => {charCode: number, width: number, name: string}[]
*/
function parseFontMetrics(data) {
  var start_match = data.match(/^StartCharMetrics\s+(\d+)/m);
  var end_match = data.match(/^EndCharMetrics/m);
  var char_metrics_data = data.slice(start_match.index + start_match[0].length, end_match.index);
  var char_metrics_lines = char_metrics_data.trim().split(/\r\n|\r|\n/);
  return char_metrics_lines.map(parseCharMetrics);
}

/**
loadFontMetrics(name: string) => {charCode: number, width: number, name: string}[]
*/
function loadFontMetricsSync(name) {
  var fonts = readFonts();
  var font_filename = fonts[name];
  var font_filepath = path.join(__dirname, font_filename);
  var data = fs.readFileSync(font_filepath, {encoding: 'ascii'});
  return parseFontMetrics(data);
}
exports.loadFontMetricsSync = loadFontMetricsSync;

Object.defineProperty(exports, 'names', {
  get: function() {
    return Object.keys(readFonts());
  }
});
