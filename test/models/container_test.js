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
      expect(Container().schemaAttrs).to.eql(['container_name']);
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
    var containersIDsFromDocker;

    before(function() {
      containersIDsFromDocker = ['999f3c428c18', '111f3c428c18'];
    });

    it('updates existing containers', function() {
      return expect(Container().updateContainersList(containersIDsFromDocker)).to.eventually.fulfilled;
    });
  });

  describe('.create()', function() {
    it('creates a new container', function() {
      return expect(Container().create({container_name: 'container_name'})).to.eventually.fulfilled;
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
