BIN := node_modules/.bin
DOMPDF := Arial_Bold_Italic Arial_Bold Arial_Italic Arial Georgia_Bold_Italic Georgia_Bold Georgia_Italic Georgia lucon slkscr slkscrb slkscre slkscreb Times_New_Roman_Bold_Italic Times_New_Roman_Bold Times_New_Roman_Italic Times_New_Roman Trebuchet_MS_Bold_Italic Trebuchet_MS_Bold Trebuchet_MS_Italic Trebuchet_MS Verdana_Bold_Italic Verdana_Bold Verdana_Italic Verdana
AFM := vendor/Adobe/Core14/*.afm vendor/dompdf/*.afm

all: vendor/Adobe/Core14 $(DOMPDF:%=vendor/dompdf/%.afm) index.d.ts index.js

%.js %.d.ts: %.ts
	$(BIN)/tsc -d

vendor/Adobe/Core14:
	# thanks to http://stackoverflow.com/a/6506818/424651 for the URL
	mkdir -p $@
	curl https://partners.adobe.com/public/developer/en/pdf/Core14_AFMs.tar | tar -x -C $@

vendor/dompdf/%.afm:
	mkdir -p $(@D)
	curl https://raw.githubusercontent.com/dompdf/dompdf/dfc72f0/lib/fonts/$*.afm > $@

# find vendor -name '*.afm' -print0 | sed 's/afm$/json/g' | xargs -0 make
vendor/%.json: vendor/%.afm
	node parse.js <$< >$@
