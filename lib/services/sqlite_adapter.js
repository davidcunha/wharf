'use strict';

var sqlite3 = require('sqlite3').verbose()
  , db = new sqlite3.cached.Database('db/dev.sqlite')
  , Q = require('q');

var SQliteAdapter = function(tableName) {
  this.tableName = tableName;
};

SQliteAdapter.prototype.validateAttrs = function(attrs) {
  var _self = this;
  if(Object.getOwnPropertyNames(attrs).length > 0) {
    Object.getOwnPropertyNames(attrs).forEach(function(attr) {
      if(_self.schemaAttrs.hasOwnProperty(attr)) {
        throw new Error('attributes are not valid');
      }
    });
    return true;
  } else {
    throw new Error('attributes are empty');
  }
};

SQliteAdapter.prototype.prepareSelection = function(attrs) {
  var selectionArgs = [];
  Object.getOwnPropertyNames(attrs).forEach(function(attr) {
    selectionArgs.push(attr + ' = ' + attrs[attr]);
  });
  return 'WHERE ' + selectionArgs.join(' AND ');
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
