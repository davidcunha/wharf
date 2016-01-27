'use strict';

var ContainerFactory = require('models/container')
  , SQliteAdapter = require('services/sqlite_adapter')
  , chai = require('chai')
  , expect = chai.expect
  , chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);

describe('ContainerFactory', function() {
  var container;

  before(function() {
    container = ContainerFactory.getInstance();
  });

  describe('#constructor', function() {
    it('returns an instantiated container and its schema attributes', function() {
      expect(container.schemaAttrs).to.eql(['id', 'container_name']);
    });

    it('returns an instantiated container and its table name', function() {
      expect(container.tableName).to.eql('containers');
    });
  });

  describe('#find()', function() {
    it('returns a container', function() {
      return expect(container.find({container_name: 'container_name'})).to.eventually.be.fulfilled;
    });
  });

  describe('#findAll()', function() {
    it('returns all containers', function() {
      return expect(container.findAll()).to.eventually.be.fulfilled;
    });
  });

  describe('#updateContainersList()', function() {
    var containersIDsFromDocker;

    before(function() {
      containersIDsFromDocker = ['999f3c428c18', '111f3c428c18'];
    });

    it('updates existing containers', function() {
      return expect(container.updateContainersList(containersIDsFromDocker)).to.eventually.fulfilled;
    });
  });

  describe('#create()', function() {
    it('creates a new container', function() {
      return expect(container.create({container_name: 'container_name'})).to.eventually.fulfilled;
    });
  });

  describe('#createBulk()', function() {
    // pending test
    it('creates bulk of containers');
  });

  after(function() {
    return new SQliteAdapter().deleteDB()
      .then(null)
      .catch(function(err) {
        console.log(err.stack);
      });
  });
});
