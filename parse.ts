import {createReadStream, createWriteStream} from 'fs'

interface CharMetrics {
  charCode: number
  width: number
  name: string
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
export function parseCharMetrics(line: string): CharMetrics {
  const charCode_match = line.match(/C\s+(\d+|-1)/)
  const width_match = line.match(/WX\s+(\d+)/)
  const name_match = line.match(/N\s+(\w+)/)
  const charCode = charCode_match ? parseInt(charCode_match[1], 10) : null
  const width = width_match ? parseInt(width_match[1], 10) : null
  const name = name_match ? name_match[1] : null
  return {charCode, width, name}
}

/**
parseFontMetrics() takes an entire AFM file as a string, finds the
"CharMetrics" section, and parses all of the char metrics lines from that
section, returning an Array of those charmetrics.
*/
export function parseFontMetrics(data: string): CharMetrics[] {
  const start_match = data.match(/^StartCharMetrics\s+(\d+)/m)
  const end_match = data.match(/^EndCharMetrics/m)
  const char_metrics_start = start_match.index + start_match[0].length
  const char_metrics_data = data.slice(char_metrics_start, end_match.index)
  const char_metrics_lines = char_metrics_data.trim().split(/\r\n|\r|\n|\t/)
  return char_metrics_lines.map(parseCharMetrics)
}

/**
Parse Adobe Font Metrics data from inputStream
and write array of CharMetrics objects to outputStream as JSON.
*/
export function convert(inputStream: NodeJS.ReadableStream,
                        outputStream: NodeJS.WritableStream,
                        callback: (error: Error) => void) {
  const chunks: Buffer[] = []
  inputStream
  .on('data', chunk => { chunks.push(chunk) })
  .on('end', () => {
    const data = Buffer.concat(chunks).toString('ascii')
    const charMetrics = parseFontMetrics(data)
    const json = JSON.stringify(charMetrics)
    outputStream.write(json)
  })
}

if (require.main === module) {
  const [, , input_argument, output_argument] = process.argv
  const inputStream = input_argument ? createReadStream(input_argument) : process.stdin
  const outputStream = output_argument ? createWriteStream(output_argument) : process.stdout
  convert(inputStream, outputStream, error => {
    if (error) throw error
    process.exit()
  })
}
