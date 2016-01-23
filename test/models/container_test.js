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

  describe('#find()', function() {
    it('returns that attributes are empty', function() {
      return expect(function() {
        container.find();
      }).to.throw('attributes are empty');
    });

    it('returns that attributes are not valid', function() {
      return expect(function() {
        container.find({container: 'container_name'});
      }).to.throw('attributes are not valid');
    });

    it('returns a container', function() {
      return expect(container.find({container_name: 'container_name'})).to.be.fulfilled;
    });
  });

  describe('#findAll()', function() {
    it('returns all containers', function() {
      return expect(container.findAll()).to.be.fulfilled;
    });
  });
});
