'use strict';

var WorkerMapper = require('services/worker_mapper').getInstance()
  , chai = require('chai')
  , sinon = require('sinon')
  , expect = chai.expect;

describe('WorkerMapper', function() {
  describe('.find()', function() {
    var workerStub;

    before(function() {
      workerStub = sinon.stub({
        id: 1,
        entity_name: 'entity',
        type: 'memory',
        process: {}
      });
    });

    context('list of workers is empty', function() {
      it('does not find any worker', function() {
        expect(WorkerMapper.find(workerStub)).to.not.be.ok;
      });
    });

    context('list of workers has workers', function() {
      before(function() {
        WorkerMapper.create(workerStub);
      });

      it('finds a worker by its ID', function() {
        expect(WorkerMapper.find(workerStub)).to.be.ok;
      });

      it('does not find worker that is not in the workers list', function() {
        var workerStubNotPresent = sinon.stub({
          id: 2,
          entity_name: 'entity',
          type: 'memory',
          process: {}
        });

        expect(WorkerMapper.find(workerStubNotPresent)).to.not.be.ok;
      });
    });
  });

  describe('.findAll()', function() {
    before(function() {
      WorkerMapper.create(sinon.stub({
        id: 2,
        entity_name: 'entity',
        type: 'memory',
        process: {}
      }));
    });

    context('list of workers has workers', function() {
      it('finds workers', function() {
        expect(WorkerMapper.findAll()).to.have.length(2);
      });
    });
  });
});
