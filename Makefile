RPD_VERSION = `cat $(VERSION_FILE)`

SRC_DIR    = src
DIST_DIR   = dist
VENDOR_DIR = vendor

VERSION_FILE = VERSION

KEFIR_FILENAME  = kefir.min.js
TIMBRE_FILENAME = timbre.min.js

KEFIR_URL  = http://pozadi.github.io/kefir/dist/kefir.min.js
TIMBRE_URL = http://mohayonao.github.io/timbre.js/timbre.js

CLOSURE_COMPILER = ./compiler.jar

JS_VERSION = ECMASCRIPT5

all: build

deps:
	mkdir -p ./$(VENDOR_DIR)

	curl -o ./$(VENDOR_DIR)/$(KEFIR_FILENAME) $(KEFIR_URL)
	curl -o ./$(VENDOR_DIR)/$(TIMBRE_FILENAME) $(TIMBRE_URL)

dist-html:
	mkdir -p ./$(DIST_DIR)
	mkdir -p ./$(DIST_DIR)/$(RPD_VERSION)

	# TODO: Add VERSION and LICENSE in the head of files

	java -jar $(CLOSURE_COMPILER) --language_in $(JS_VERSION) \
	                              --js ./$(SRC_DIR)/rpd.js \
	                              --js ./$(SRC_DIR)/toolkit/core/toolkit.js \
							  	  --js ./$(SRC_DIR)/toolkit/core/render/html.js \
								  --js_output_file ./$(DIST_DIR)/rpd-core-html.min.js

	cp ./$(DIST_DIR)/rpd-core-html.min.js ./$(DIST_DIR)/$(RPD_VERSION)

	cp ./$(SRC_DIR)/toolkit/core/render/html.css ./$(DIST_DIR)/rpd-core.css
	cp ./$(SRC_DIR)/toolkit/core/render/html.css ./$(DIST_DIR)/$(RPD_VERSION)/rpd-core.css

dist-pd-html:

	mkdir -p ./$(DIST_DIR)
	mkdir -p ./$(DIST_DIR)/$(RPD_VERSION)

	java -jar $(CLOSURE_COMPILER) --language_in $(JS_VERSION) \
	                              --js ./$(SRC_DIR)/rpd.js \
	                              --js ./$(SRC_DIR)/toolkit/core/toolkit.js \
	                              --js ./$(SRC_DIR)/toolkit/core/render/html.js \
								  --js ./$(SRC_DIR)/toolkit/pd/toolkit.js \
								  --js ./$(SRC_DIR)/toolkit/pd/render/html.js \
	                              --js_output_file ./$(DIST_DIR)/rpd-core-pd-html.min.js

	cp ./$(DIST_DIR)/rpd-core-pd-html.min.js ./$(DIST_DIR)/$(RPD_VERSION)

	cat ./$(SRC_DIR)/toolkit/core/render/html.css ./$(SRC_DIR)/toolkit/pd/render/html.css > ./$(DIST_DIR)/rpd-core-pd.css
	cp ./$(DIST_DIR)/rpd-core-pd.css ./$(DIST_DIR)/$(RPD_VERSION)/rpd-core-pd.css

.PHONY:  all deps dist-html dist-pd-html
.SILENT: all deps dist-html dist-pd-html
