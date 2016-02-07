'use strict';

var StatsWorker = require('models/stats_worker')
  , chai = require('chai')
  , expect = chai.expect;

describe('StatsWorker', function() {
  describe('.constructor', function() {
    it('returns error if id is missing', function() {
      expect(function() { new StatsWorker() }).to.throw(Error, '\'id\' is undefined');
    });

    it('returns error if entityName is missing', function() {
      expect(function() { new StatsWorker({id: 1}) }).to.throw(Error, '\'entityName\' is undefined');
    });

    it('returns error if type is missing', function() {
      expect(function() { new StatsWorker({id: 1, entityName: 'entityName'}) }).to.throw(Error, '\'type\' is undefined');
    });

    it('returns error if process is missing', function() {
      expect(function() { new StatsWorker({id: 1, entityName: 'entityName', type: 'memory'}) }).to.throw(Error, '\'process\' is undefined');
    });

    it('returns a valid worker', function() {
      expect(new StatsWorker({id: 1, entityName: 'entityName', type: 'memory', process: {}})).to.be.ok;
    });
  });
});
