DOMPDF := Arial_Bold_Italic Arial_Bold Arial_Italic Arial Georgia_Bold_Italic Georgia_Bold Georgia_Italic Georgia lucon slkscr slkscrb slkscre slkscreb Times_New_Roman_Bold_Italic Times_New_Roman_Bold Times_New_Roman_Italic Times_New_Roman Trebuchet_MS_Bold_Italic Trebuchet_MS_Bold Trebuchet_MS_Italic Trebuchet_MS Verdana_Bold_Italic Verdana_Bold Verdana_Italic Verdana

all: vendor/Adobe/Core14 $(DOMPDF:%=vendor/dompdf/%.afm)

vendor/Adobe/Core14:
	# thanks to https://stackoverflow.com/a/6506818 for the URL
	curl https://partners.adobe.com/public/developer/en/pdf/Core14_AFMs.tar | tar -x -C $@

vendor/dompdf/%.afm:
	curl https://raw.githubusercontent.com/dompdf/dompdf/dfc72f0/lib/fonts/$*.afm > $@
