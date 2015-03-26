all: vendor/Adobe/Core14

vendor/Adobe/Core14:
	mkdir -p $@
	curl https://partners.adobe.com/public/developer/en/pdf/Core14_AFMs.tar | tar -x -C $@
