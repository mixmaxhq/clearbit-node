'use strict';

var expect = require('chai').expect;
var nock   = require('nock');
var Client = require('../src/client');

describe('Person', function () {

  var client = new Client({key: 'k'});
  var Person = require('../src/person')(client);

  var mock;
  before(function () {
    mock = nock('https://person.clearbit.co');
  });
  after(nock.cleanAll);
  afterEach(function () {
    mock.done();
  });

  describe('#pending', function () {

    it('identifies whether the person has an id', function () {
      var person = new Person();
      expect(person.pending()).to.be.true;
      person.id = 'foo';
      expect(person.pending()).to.be.false;
    });

  });

  describe('Person#find', function () {

    it('can find a person by email', function () {
      var alex = require('./fixtures/person');
      mock
        .get('/v1/people/email/alex@alexmaccaw.com')
        .reply(200, alex);
      return Person.find({email: 'alex@alexmaccaw.com'})
        .then(function (person) {
          expect(person)
            .to.be.an.instanceOf(Person)
            .and.have.property('id', alex.id);
        });
    });

  });

});