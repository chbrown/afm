declare var process: { stdout: any; stdin: any };
declare var require: { (id: string): any; main: any };
declare var module: any;

var fs = require('fs');

interface CharMetrics {
  charCode: number;
  width: number;
  name: string;
}

/**
parseCharMetrics() takes a single line from the "CharMetrics" section in an
AFM file, and extracts the crucial metrics for that character. For example, the
line describing capital A in Times-Roman from Adobe's Core14 font set is this:

    C 65 ; WX 722 ; N A ; B 15 0 706 674 ;

For which parseCharMetrics() would return a plain object:

    { charCode: 65, width: 722, name: 'A' }

From https://partners.adobe.com/public/developer/en/font/5004.AFM_Spec.pdf:

> `C integer`: Decimal value of default character code (−1 if not encoded).
> `CH` hex`:   Same as C, but the character code is given in hexadecimal.
               Either C or CH is required
> `WX number`: Width of character.
> `N name`:    (Optional.) PostScript language character name.
*/
function parseCharMetrics(line: string): CharMetrics {
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
parseFontMetrics() takes an entire AFM file as a string, finds the
"CharMetrics" section, and parses all of the char metrics lines from that
section, returning an Array of those charmetrics.
*/
function parseFontMetrics(data: string): CharMetrics[] {
  var start_match = data.match(/^StartCharMetrics\s+(\d+)/m);
  var end_match = data.match(/^EndCharMetrics/m);
  var char_metrics_start = start_match.index + start_match[0].length;
  var char_metrics_data = data.slice(char_metrics_start, end_match.index);
  var char_metrics_lines = char_metrics_data.trim().split(/\r\n|\r|\n|\t/);
  return char_metrics_lines.map(parseCharMetrics);
}

/**
reads an AFM file included in this repository and parses the character metrics
defined in that file.
*/
if (require.main === module) {
  var chunks = [];
  process.stdin.setEncoding('ascii')
  .on('data', chunk => chunks.push(chunk))
  .on('end', () => {
    var data = chunks.join('');
    var charMetrics = parseFontMetrics(data);
    var json = JSON.stringify(charMetrics);
    process.stdout.write(json);
  });
}
