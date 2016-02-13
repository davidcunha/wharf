'use strict';

var StatsWorkerMapper = require('models/stats_worker_mapper')
  , chai = require('chai')
  , sinon = require('sinon')
  , expect = chai.expect;

describe('StatsWorkerMapper', function() {
  var statsWorkerStubs = [];
  var statsWorkerMapper;

  before(function() {
    statsWorkerMapper = sinon.mock(new StatsWorkerMapper()).object;
    for(var i = 0; i < 2; i++) {
      statsWorkerStubs.push(sinon.stub({
        entityName: 'entityName' + i,
        process: {},
        interval: sinon.useFakeTimers().tick(1000)
      }));

      statsWorkerMapper.create(statsWorkerStubs[i].process, statsWorkerStubs[i].entityName);
    }
  });

  describe('.find()', function() {
    context('list of workers has workers', function() {
      it('finds a worker by its ID', function() {
        expect(statsWorkerMapper.find(statsWorkerStubs[0])).to.be.ok;
      });
    });
  });

  describe('.findAll()', function() {
    context('list of workers has workers', function() {
      it('finds workers', function() {
        expect(statsWorkerMapper.findAll()).to.have.length(2);
      });
    });
  });

  describe('.kill()', function() {
    context('list of workers has workers', function() {
      it('kills a worker', function() {
        expect(statsWorkerMapper.kill({entityName: statsWorkerStubs[1].entityName})).to.be.true;
        expect(statsWorkerMapper.findAll()).to.have.length(1);
      });
    });
  });
});
