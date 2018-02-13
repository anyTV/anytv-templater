'use strict';

const templater = require('../index.js');
const should = require('chai').should();
const path = require('path');


describe('Overall test', function () {

    templater.configure({
        templates_dir: path.normalize(__dirname + '/templates/')
    });


    it('should generate the right template', function (done) {

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


    it('should generate with a custom template', function (done) {

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


    it('should generate the right template even if language is not present', function (done) {

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


    it('should not crash even if some fields are null', function (done) {

        templater.make
            .template('sample')
            .content({
                date: null,
                hello: {
                    trans: 'hello',
                    data: {
                        name: 'raven'
                    }
                }
            })
            .build(function (err, html) {
                html.should.be.equal(', This is a sample email. hello');
                done();
            });
    });


    it('should throw an error if provided trans is an array', function (done) {

        function misuse () {
            templater.make
                .template('sample')
                .content({
                    date: null,
                    hello: {
                        trans: [],
                        data: {
                            name: 'raven'
                        }
                    }
                })
                .build(function () {
                    done('did not throw an error');
                });
        }

        misuse.should.throw();
        done();
    });

});
