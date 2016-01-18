'use strict';

var sqlite3 = require('sqlite3').verbose()
  , db = new sqlite3.cached.Database('db/dev.sqlite')
  , Q = require('q');

var SQliteORM = function(tableName) {
  this.tableName = tableName;
  this.queryGenerator = QueryGenerator(this.tableName);
};

SQliteORM.prototype.find = function(attrs) {
  attrs = attrs || {};
  var query = this.queryGenerator.selectQuery(attrs);

  return new Q.promise(function(resolve, reject) {
    db.serialize(function() {
      db.get(query, function(err, row) {
        if(err) reject();
        resolve(row);
      });
    });
  });
};

function QueryGenerator(tableName) {
  var self = {};

  var _validateAttrs = function(attrs) {
    if(Object.keys(attrs).length > 0)
      return true;
    else
      throw new Error('attributes are empty');
  };

  self.selectQuery = function(attrs) {
    if(_validateAttrs(attrs))
      return 'SELECT * from ' + tableName + ' WHERE id = 1';
  };

  return self;
}

module.exports = SQliteORM;
