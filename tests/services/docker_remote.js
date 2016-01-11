require('../tests');
var DockerRemote = require(__services + 'docker_remote');

describe('DockerRemote', function() {
  var containerID;

  describe('.stats()', function() {
    beforeEach(function() {
      containerID = '999f3c428c18';
    });

    it('returns stats from a container', function() {
      var dockerRemoteMock = sinon.mock(DockerRemote);
      dockerRemoteMock.expects('stats').withArgs(containerID).once();

      DockerRemote.stats(containerID);

      dockerRemoteMock.verify();
    });
  });

  describe('.containers()', function() {
    it('returns list of containers', function() {
      var dockerRemoteMock = sinon.mock(DockerRemote);
      dockerRemoteMock.expects('containers').once();

      DockerRemote.containers();

      dockerRemoteMock.verify();
    });
  });
});
