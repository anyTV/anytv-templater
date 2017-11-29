'use strict';


const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');


const Templater = require('../index').Templater;


chai.should();
chai.use(sinonChai);


describe('#Templater', function () {


    describe('#Templater.derive_language', function () {


        let templater;
        let spy;

        beforeEach('setUp', function () {
            templater = new Templater({});
            spy = sinon.spy(templater, 'derive_language');
        });

        it('should derive the language gives lowercase country code', function (done) {

            templater.derive_language('ar');

            spy.should.have.been.calledWith('ar');
            spy.thisValues[0]._language.should.be.equals('es');

            done();
        });


        it('should derive the language given uppercase country code', function (done) {

            templater.derive_language('AR');

            spy.should.have.been.calledWith('AR');
            spy.thisValues[0]._language.should.be.equals('es');

            done();
        });


        it('should derive the language given lowercase country name', function (done) {

            templater.derive_language('argentina');

            spy.should.have.been.calledWith('argentina');
            spy.thisValues[0]._language.should.be.equals('es');

            done();
        });


        it('should derive the language gives uppercase country name', function (done) {

            templater.derive_language('ARGENTINA');

            spy.should.have.been.calledWith('ARGENTINA');
            spy.thisValues[0]._language.should.be.equals('es');

            done();
        });


        it('should derive the language gives proper case country name', function (done) {

            templater.derive_language('Argentina');

            spy.should.have.been.calledWith('Argentina');
            spy.thisValues[0]._language.should.be.equals('es');

            done();
        });

        afterEach('tearDown', function () {
            templater.derive_language.restore();
        });
    });
});
