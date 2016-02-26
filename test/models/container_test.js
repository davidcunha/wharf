'use strict';

var Container = require('models/container')
  , SQliteAdapter = require('models/sqlite_adapter')
  , chai = require('chai')
  , expect = chai.expect
  , chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);

describe('Container', function() {
  describe('.constructor', function() {
    it('returns an instantiated container and its schema attributes', function() {
      expect(Container().schemaAttrs).to.eql(['container_name', 'container_image', 'container_alias']);
    });

    it('returns an instantiated container and its table name', function() {
      expect(Container().tableName).to.eql('containers');
    });
  });

  describe('.find()', function() {
    it('returns a container', function() {
      return expect(Container().find({container_name: 'container_name'})).to.eventually.be.fulfilled;
    });
  });

  describe('.findAll()', function() {
    it('returns all containers', function() {
      return expect(Container().findAll()).to.eventually.be.fulfilled;
    });
  });

  describe('.updateContainersList()', function() {
    var containersFromDocker;

    before(function() {
      containersFromDocker = [{Id:'999f3c428c18', Names: ['/container'], Image: 'container_image'},
                                {Id:'111f3c428c18', Names: ['/container1'], Image: 'container_image1'}];
    });

    it('updates existing containers', function() {
      return expect(Container().updateContainersList(containersFromDocker)).to.eventually.fulfilled;
    });
  });

  describe('.create()', function() {
    it('creates a new container', function() {
      return expect(Container().create({container_name: 'container_name',
                                      container_image: 'container_image',
                                      container_alias: 'container_alias'})).to.eventually.fulfilled;
    });
  });

  describe('.update()', function() {
    it('updates a existing container', function() {
      return expect(Container().update({container_name: 'container_name'},
                                      {container_name: 'container_name_updated'})).to.eventually.be.fulfilled;
    });
  });

  after(function() {
    return SQliteAdapter.deleteDB()
      .then(null)
      .catch(function(err) {
        console.log(err.stack);
      });
  });
});
