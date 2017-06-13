'use strict';

const templater = require('../index.js');
const should = require('chai').should();
const i18n = require('anytv-i18n');
const path = require('path');


describe('Overall test', () => {

    i18n.configure({
            languages_url: 'http://localhost:8081/:project/languages.json',
            translations_url: 'http://localhost:8081/:project/:lang.json',
            default: 'en'
        })
        .use('test_project')
        .load();

    templater.configure({
        templates_dir: path.normalize(__dirname + '/templates/'),
        i18n
    });


    it('should generate the right template', done => {

        templater.make
            .template('sample')
            .content({
                date: 'Feb 17',
                hello: {
                    trans: 'hello',
                    data: {
                        name: 'raven'
                    }
                }
            })
            .build(function (err, html) {
                html.should.be.equal('Feb 17, This is a sample email. Hello raven');
                done();
            });
    });


    it('should generate the right template with the right language', done => {

        templater.make
            .language('zh')
            .template('sample')
            .content({
                date: 'Feb 17',
                hello: {
                    trans: 'hello',
                    data: {
                        name: 'raven'
                    }
                }
            })
            .build(function (err, html) {
                html.should.be.equal('Feb 17, This is a sample email. 你好 raven');
                done();
            });
    });

});
