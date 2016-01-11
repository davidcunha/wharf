require('../tests');
var DockerRemote = require(__services + 'docker_remote');

describe('DockerRemote', function() {
  var containerID;

  beforeEach(function() {
    containerID = '999f3c428c18';
  });

  describe('.stats()', function() {
    it('returns stats from a container', function() {
      var dockerRemoteMock = sinon.mock(DockerRemote);
      dockerRemoteMock.expects('stats').withArgs(containerID).once();

      DockerRemote.stats(containerID);

      dockerRemoteMock.verify();
    });
  });
});
