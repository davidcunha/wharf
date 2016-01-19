'use strict';

var sqlite3 = require('sqlite3').verbose()
  , db = new sqlite3.cached.Database('db/dev.sqlite')
  , Q = require('q');

var SQliteAdapter = function(tableName) {
  this.tableName = tableName;
};

SQliteAdapter.prototype.validateAttrs = function(attrs) {
  var _self = this;
  if(Object.keys(attrs).length > 0) {
    Object.keys(attrs).forEach(function(attr) {
      if(_self.schemaAttrs.indexOf(attr) < 0) {
        throw new Error('attributes are not valid');
      }
    });
    return true;
  } else {
    throw new Error('attributes are empty');
  }
};

SQliteAdapter.prototype.execute = function(query) {
  return new Q.promise(function(resolve, reject) {
    db.serialize(function() {
      db.get(query, function(err, row) {
        if(err) reject();
        resolve(row);
      });
    });
  });
};

module.exports = SQliteAdapter;
