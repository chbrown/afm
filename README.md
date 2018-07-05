# afm

[![latest version published to npm](https://badge.fury.io/js/afm.svg)](https://www.npmjs.com/package/afm)

Collection of AFM (Adobe Font Metrics) specifications in JSON format, with CommonJS JavaScript API.


## Installation

```shell
npm install afm
```


## Example

```javascript
var afm = require('afm')
afm.fonts.ArialMT
```


## Development

To (re)fetch the original files at `vendor/**/*.afm` from the internet:

```shell
make
```

To (re)generate the JSON files by parsing the character metrics for each AFM file in the repository:

```shell
npm run prepublishOnly
```


## References

* ["What can I do with AFM - Adobe font metrics file?"](https://graphicdesign.stackexchange.com/q/2564) from StackExchange: Graphic Design
* [Font technical notes](https://www.adobe.com/devnet/font.html)
  - [Adobe Font Metrics File Format Specification #5004](https://www.adobe.com/content/dam/acom/en/devnet/font/pdfs/5004.AFM_Spec.pdf)


## License

Copyright 2015–2018 Christopher Brown.
[MIT Licensed](https://chbrown.github.io/licenses/MIT/#2015-2018).
