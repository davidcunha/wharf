'use strict';

var Container = require('models/container')
  , expect = require('chai').expect;

describe('Container', function() {
  describe('#constructor', function() {
    var container;

    before(function() {
      container = new Container();
    });

    it('instantiate a Container that inherits from SQliteAdapter', function() {
      expect(container.schemaAttrs).to.eql(['id', 'container_name']);
    });

    it('the Container tableName is containers', function() {
      expect(container.tableName).to.eql('containers');
    });
  });
});
