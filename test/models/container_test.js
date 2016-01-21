'use strict';

var ContainerFactory = require('models/container')
  , chai = require('chai')
  , expect = chai.expect
  , sinon = require('sinon')
  , chaiAsPromised = require("chai-as-promised");

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

  describe('#findAll()', function() {
    it('returns all containers', function() {
      return expect(container.findAll()).to.be.fulfilled;
    });
  });
});
