'use strict';

var DockerRemote = require('../../src/services/docker_remote')
  , chai = require('chai')
  , expect = chai.expect
  , sinon = require('sinon')
  , chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);

describe('DockerRemote', function() {
  var containerID;
  var dockerRemoteMock;

  beforeEach(function() {
    dockerRemoteMock = sinon.mock(DockerRemote);
  });

  describe('.stats()', function() {
    before(function() {
      containerID = '999f3c428c18';
    });

    it('returns stats from a container', function() {
      dockerRemoteMock.expects('stats').withArgs(containerID).once();
      DockerRemote.stats(containerID);
      dockerRemoteMock.verify();
    });
  });

  describe('.containers()', function() {
    it('returns list of containers', function() {
      dockerRemoteMock.expects('containers').once();
      DockerRemote.containers();
      dockerRemoteMock.verify();
    });
  });

  describe('.containersIDs()', function() {
    it('returns list of containers IDs', function() {
      return expect(DockerRemote.containersIDs()).to.eventually.be.fulfilled;
    });
  });

  describe('.processes()', function() {
    it('returns list of processes', function() {
      dockerRemoteMock.expects('processes').once();
      DockerRemote.processes();
      dockerRemoteMock.verify();
    });
  });

  describe('.info()', function() {
    it('returns system info', function() {
      dockerRemoteMock.expects('info').once();
      DockerRemote.info();
      dockerRemoteMock.verify();
    });
  });
});
