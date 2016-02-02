'use strict';

var Worker = require('models/worker')
  , chai = require('chai')
  , expect = chai.expect;

describe('Worker', function() {
  describe('#constructor', function() {
    it('returns error if id is missing', function() {
      expect(function() { new Worker() }).to.throw(Error, '\'id\' is undefined');
    });

    it('returns error if entity_name is missing', function() {
      expect(function() { new Worker({id: 1}) }).to.throw(Error, '\'entity_name\' is undefined');
    });

    it('returns error if type is missing', function() {
      expect(function() { new Worker({id: 1, entity_name: 'entity_name'}) }).to.throw(Error, '\'type\' is undefined');
    });

    it('returns error if process is missing', function() {
      expect(function() { new Worker({id: 1, entity_name: 'entity_name', type: 'memory'}) }).to.throw(Error, '\'process\' is undefined');
    });

    it('returns a valid worker', function() {
      expect(new Worker({id: 1, entity_name: 'entity_name', type: 'memory', process: {}})).to.be.ok;
    });
  });
});
