'use strict';

var StatsWorkerMapper = require('models/stats_worker_mapper')
  , chai = require('chai')
  , sinon = require('sinon')
  , expect = chai.expect;

describe('StatsWorkerMapper', function() {
  var statsWorkerStubs = [];

  before(function() {
    for(var i = 1; i <= 3; i++) {
      statsWorkerStubs.push(sinon.stub({
        id: i,
        entity_name: 'entity',
        type: 'memory',
        process: {},
        interval: sinon.useFakeTimers().tick(1000)
      }));
    }
  });

  describe('.find()', function() {
    context('list of workers is empty', function() {
      it('does not find any worker', function() {
        expect(StatsWorkerMapper.find(statsWorkerStubs[0])).to.not.be.ok;
      });
    });

    context('list of workers has workers', function() {
      before(function() {
        StatsWorkerMapper.create(statsWorkerStubs[0]);
      });

      it('finds a worker by its ID', function() {
        expect(StatsWorkerMapper.find(statsWorkerStubs[0])).to.be.ok;
      });

      it('does not find a worker', function() {
        expect(StatsWorkerMapper.find(statsWorkerStubs[1])).to.not.be.ok;
      });
    });
  });

  describe('.findAll()', function() {
    before(function() {
      StatsWorkerMapper.create(statsWorkerStubs[1]);
    });

    context('list of workers has workers', function() {
      it('finds workers', function() {
        expect(StatsWorkerMapper.findAll()).to.have.length(2);
      });
    });
  });

  describe('.destroy()', function() {
    before(function() {
      StatsWorkerMapper.create(statsWorkerStubs[2]);
    });

    context('list of workers has workers', function() {
      it('destroys a worker', function() {
        expect(StatsWorkerMapper.destroy({id: statsWorkerStubs[2].id})).to.be.true;
        expect(StatsWorkerMapper.findAll()).to.have.length(2);
      });
    });
  });
});
