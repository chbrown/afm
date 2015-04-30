declare module "afm" {
    /**
    vendor_font_names lists the names of fonts that have metrics defined in this
    repository.
    */
    var vendor_font_names: string[];
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
    function parseCharMetrics(line: string): CharMetrics;
    /**
    parseFontMetrics() takes an entire AFM file as a string, finds the
    "CharMetrics" section, and parses all of the char metrics lines from that
    section, returning an Array of those charmetrics.
    */
    function parseFontMetrics(data: string): CharMetrics[];
    /**
    readVendorFontMetricsSync reads an AFM file included in this repository and
    parses the character metrics defined in that file.
    */
    function readVendorFontMetricsSync(name: string): CharMetrics[];
}
