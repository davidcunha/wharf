'use strict';

var WorkerMapper = require('services/worker_mapper').getInstance()
  , chai = require('chai')
  , sinon = require('sinon')
  , expect = chai.expect;

describe('WorkerMapper', function() {
  var workerStubs = [];

  before(function() {
    for(var i = 1; i <= 3; i++) {
      workerStubs.push(sinon.stub({
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
        expect(WorkerMapper.find(workerStubs[0])).to.not.be.ok;
      });
    });

    context('list of workers has workers', function() {
      before(function() {
        WorkerMapper.create(workerStubs[0]);
      });

      it('finds a worker by its ID', function() {
        expect(WorkerMapper.find(workerStubs[0])).to.be.ok;
      });

      it('does not find a worker', function() {
        expect(WorkerMapper.find(workerStubs[1])).to.not.be.ok;
      });
    });
  });

  describe('.findAll()', function() {
    before(function() {
      WorkerMapper.create(workerStubs[1]);
    });

    context('list of workers has workers', function() {
      it('finds workers', function() {
        expect(WorkerMapper.findAll()).to.have.length(2);
      });
    });
  });

  describe('.destroy()', function() {
    before(function() {
      WorkerMapper.create(workerStubs[2]);
    });

    context('list of workers has workers', function() {
      it('destroys a worker', function() {
        expect(WorkerMapper.destroy({id: workerStubs[2].id})).to.be.true;
        expect(WorkerMapper.findAll()).to.have.length(2);
      });
    });
  });
});
