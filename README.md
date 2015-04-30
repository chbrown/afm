> `C integer`: Decimal value of default character code (−1 if not encoded).
> `CH` hex`: Same as C, but the character code is given in hexadecimal.
               Either C or CH is required
> `WX number`: Width of character.
> `N name`: (Optional.) PostScript language character name.

for FILE in **/*.afm; do
  echo $(sed -n 's/FontName \(.*\)/\1/p' $FILE) $FILE
done

awk '/^FontName/ { sub(/\r/, ""); print $2, FILENAME}' **/*.afm

perl -n -e'/test(\d+)/ && print $1'

var afm = require('afm');
afm.names;
afm.loadFontMetricsSync('ArialMT');
