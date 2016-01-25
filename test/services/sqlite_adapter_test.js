'use strict';

var SQliteAdapter = require('services/sqlite_adapter')
  , chai = require('chai')
  , expect = chai.expect;

describe('SQliteAdapter', function() {
  var sqliteAdapter;

  before(function() {
    sqliteAdapter = new SQliteAdapter();
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
});
