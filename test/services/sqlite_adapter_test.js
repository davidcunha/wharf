'use strict';

var SQliteAdapter = require('services/sqlite_adapter')
  , chai = require('chai')
  , expect = chai.expect;

describe('SQliteAdapter', function() {
  var sqliteAdapter;

  before(function() {
    sqliteAdapter = new SQliteAdapter('containers');
    sqliteAdapter.schemaAttrs = ['id', 'container_name'];
  });

  describe('#validateAttrs', function() {
    it('returns validation for attributes used for query', function() {
      expect(sqliteAdapter.validateAttrs.apply(sqliteAdapter, [{id: 'id', container_name: 'container_name'}])).to.be.ok;
    });

    it('returns validation for attributes used for projection', function() {
      expect(sqliteAdapter.validateAttrs.apply(sqliteAdapter, [null, ['container_name']])).to.be.ok;
    });

    it('returns validation for attributes used for all query', function() {
      expect(sqliteAdapter.validateAttrs.apply(sqliteAdapter, [{id: 'id', container_name: 'container_name'}, ['container_name']])).to.be.ok;
    });

    it('returns that attributes are not valid', function() {
      expect(sqliteAdapter.validateAttrs.apply(sqliteAdapter, [{id: 'id', container: 'container'}])).to.be.false;
    });

    it('returns that attributes are not valid', function() {
      expect(sqliteAdapter.validateAttrs.apply(sqliteAdapter, [{}])).to.be.false;
    });
  });

  describe('#selection', function() {
    it('returns selection attributes', function() {
      var attrs = {container_name: 'container_name'};
      expect(sqliteAdapter.selection(attrs)).to.be.eql('WHERE container_name = container_name');
    });
  });

  describe('#projection', function() {
    it('returns projection attributes', function() {
      var attrs = ['id', 'container_name'];
      expect(sqliteAdapter.projection(attrs)).to.be.eql('id,container_name');
    });

    it('returns wildcard in projection attributes', function() {
      var attrs = [];
      expect(sqliteAdapter.projection(attrs)).to.be.eql('*');
    });
  });

  describe('#insertion', function() {
    it('returns insertion attributes', function() {
      var attrs = {id: '1', container_name: 'container_name'};
      expect(sqliteAdapter.insertion(attrs)).to.be.eql('(id,container_name) VALUES (\'1\',\'container_name\')');
    });
  });  
});
