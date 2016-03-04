'use strict';

var MemoryStats = require('../../src/models/memory_stats')
  , SQliteAdapter = require('../../src/models/sqlite_adapter')
  , chai = require('chai')
  , expect = chai.expect
  , chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);

describe('MemoryStats', function() {
  describe('.constructor', function() {
    it('returns an instantiated memory stats and its schema attributes', function() {
      expect(MemoryStats().schemaAttrs).to.include.members(['container_name', 'timestamp_day']);
    });

    it('returns an instantiated memory stats and its table name', function() {
      expect(MemoryStats().tableName).to.eql('memory_stats');
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
