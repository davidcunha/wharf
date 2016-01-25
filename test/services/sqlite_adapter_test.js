'use strict';

var SQliteAdapter = require('services/sqlite_adapter')
  , chai = require('chai')
  , expect = chai.expect;

describe('SQliteAdapter', function() {
  var sqliteAdapter;

  before(function() {
    sqliteAdapter = new SQliteAdapter();
  });

  describe('#validateAttrs', function() {
    it('returns validation for attributes used for query', function() {
      sqliteAdapter.schemaAttrs = ['id', 'container_name'];
      expect(sqliteAdapter.validateAttrs.apply(sqliteAdapter, [{id: 'id', container_name: 'container_name'}])).to.be.ok;
    });

    it('returns that attributes are not valid', function() {
      sqliteAdapter.schemaAttrs = ['id', 'container_name'];
      expect(function() {
        sqliteAdapter.validateAttrs.apply(sqliteAdapter, [{id: 'id', container: 'container'}]);
      }).to.throw('attributes are not valid');
    });

    it('returns that attributes are empty', function() {
      sqliteAdapter.schemaAttrs = ['id', 'container_name'];
      expect(function() {
        sqliteAdapter.validateAttrs.apply(sqliteAdapter, [{}]);
      }).to.throw('attributes are empty');
    });
  });
});
