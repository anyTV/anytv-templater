'use strict';

const templater = require('../index.js');
const should = require('chai').should();
const path = require('path');


describe('Overall test', () => {

    templater.configure({

        i18n: {
            languages_url: 'http://localhost:8081/:project/languages.json',
            translations_url: 'http://localhost:8081/:project/:lang.json',
            project: 'test_project',
            default: 'en'
        },

        templates_dir: path.normalize(__dirname + '/templates/')
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
