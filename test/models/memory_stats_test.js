'use strict';

var MemoryStats = require('models/memory_stats')
  , SQliteAdapter = require('services/sqlite_adapter')
  , chai = require('chai')
  , expect = chai.expect
  , chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);

describe('MemoryStats', function() {
  var memoryStats;

  before(function() {
    memoryStats = new MemoryStats();
  });

  describe('#constructor', function() {
    it('returns an instantiated memory stats and its schema attributes', function() {
      expect(memoryStats.schemaAttrs).to.include.members(['id', 'container_id', 'timestamp_day']);
    });

    it('returns an instantiated memory stats and its table name', function() {
      expect(memoryStats.tableName).to.eql('memory_stats');
    });
  });

  after(function() {
    return new SQliteAdapter().deleteDB()
      .then(null)
      .catch(function(err) {
        console.log(err.stack);
      });
  });
});
