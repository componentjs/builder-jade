BIN = ./node_modules/.bin/
NODE ?= gnode

test:
	@$(NODE) $(BIN)mocha \
		--require should \
		--reporter spec \
		--harmony-generators \
		--bail

.PHONY: test