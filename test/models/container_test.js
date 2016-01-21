'use strict';

var ContainerFactory = require('models/container')
  , expect = require('chai').expect;

describe('ContainerFactory', function() {
  describe('#constructor', function() {
    var container;

    before(function() {
      container = ContainerFactory.getInstance();
    });

    it('instantiate a Container that inherits from SQliteAdapter', function() {
      expect(container.schemaAttrs).to.eql(['id', 'container_name']);
    });

    it('the Container tableName is containers', function() {
      expect(container.tableName).to.eql('containers');
    });
  });
});
