# anytv-templater
[![Build Status](https://travis-ci.org/anyTV/anytv-templater.svg?branch=master)](https://travis-ci.org/anyTV/anytv-templater)

A module for building content string from templates


## Install

```sh
npm i anytv-templater@latest --save
```

## Introduction

Simple example:
```js
'use strict';


const templater = require('anytv-templater');
const i18n = require('anytv-i18n');

// make sure i18n is loaded before passing it on templater

// on server.js
templater.configure({
    
    i18n: i18n,

    templates_dir: 'directory/of/templates'
});



// call to build
templater.make

    // specify language explicitly
    .language('en')

    // or derive using country/country code
    .derive_language(row.user_country, row.channel_country)

    .template('my_template')

    .content({
        /**
         * the keys are the template variables, values can be string/number/object
         * object value will be used to call i18n.trans
         */
        email_body: { trans: 'monetization-suspended-email', data: {channel_name: row.channel_name}},
        email_greetings: { trans: 'email-greetings'},
        thank_you: { trans: 'thank-you'},
        the_freedom_team: { trans: 'the-freedom-team'},
        our_mailing_address: { trans: 'our-mailing-address'},
        year: (new Date()).getFullYear()
    })


    // will just build the whole string plus metadata
    .build(function (err, html) {

    });

```


# Todo
- [ ] Complete test cases


# Contributing

Install the tools needed:
```sh
sudo npm i grunt -g
npm i
```

To compile the ES6 source code to ES5:
```sh
npm start
```


# Running test

```sh
sudo npm i serve_me -g
serve_me test/locales 8081
npm test
```


# License

MIT


# Author
[Freedom! Labs, any.TV Limited DBA Freedom!](https://www.freedom.tm)
