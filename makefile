JS_FILES = \
	src/intro.js \
	src/core.js \
	src/utils.js \
	src/axis.js \
	src/line.js \
	src/legend.js \
	src/chart.js \
	src/outro.js

JS_COMPILER = \
	uglifyjs

all: d3licia.js d3licia.min.js
d3licia.js: $(JS_FILES)
d3licia.min.js: $(JS_FILES)

d3licia.js: Makefile
	rm -f $@
	cat $(filter %.js,$^) >> $@

%.min.js:: Makefile
	rm -f $@
	cat $(filter %.js,$^) | $(JS_COMPILER) >> $@

clean:
	rm -rf d3licia.js d3licia.min.js