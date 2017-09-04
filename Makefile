mocha_option := --recursive -t 10000 -s 1000
test:
	@NODE_ENV=test ./node_modules/.bin/mocha -R spec $(mocha_option)

.PHONY: test
