'use strict';

const templater = require('../index.js');
const should = require('chai').should();
const path = require('path');


describe('Overall test', () => {

    templater.configure({
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
                html.should.be.equal('Feb 17, This is a sample email. hello');
                done();
            });
    });


    it('should generate with a custom template', done => {

        templater.make
            .template(path.normalize(__dirname + '/custom_templates/custom'))
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
                html.should.be.equal('Feb 17, This is a custom sample email. hello');
                done();
            });
    });


    it('should generate the right template even if language is not present', done => {

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
                html.should.be.equal('Feb 17, This is a sample email. hello');
                done();
            });
    });

});
