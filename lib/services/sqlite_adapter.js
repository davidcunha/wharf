'use strict';

var sqlite3 = require('sqlite3').verbose()
  , db = new sqlite3.cached.Database('db/dev.sqlite')
  , Q = require('q');

var SQliteAdapter = function(tableName) {
  this.tableName = tableName;
};

SQliteAdapter.prototype.all = function(query) {
  return new Q.promise(function(resolve, reject) {
    db.serialize(function() {
      db.all(query, function(err, row) {
        if(err) reject(err);
        resolve(row);
      });
    });
    db.close();
  });
};

SQliteAdapter.prototype.exec = function(query) {
  return new Q.promise(function(resolve, reject) {
    db.serialize(function() {
      db.exec(query, function(err, _) {
        if(err) reject(err);
        resolve('success ' + _);
      });
    });
    db.close();
  });
};

SQliteAdapter.prototype.validateAttrs = function(attrs) {
  var _self = this;
  if(Object.getOwnPropertyNames(attrs).length > 0) {
    Object.getOwnPropertyNames(attrs).forEach(function(attr) {
      if(_self.schemaAttrs.hasOwnProperty(attr))
        throw new Error('attributes are not valid');
    });
    return true;
  } else {
    throw new Error('attributes are empty');
  }
};

SQliteAdapter.prototype.prepareSelection = function(attrs) {
  var selectionArgs = Object.getOwnPropertyNames(attrs).map(function(attr) {
    return (attr + ' = ' + attrs[attr]);
  }).join(' AND ');
  return 'WHERE ' + selectionArgs;
};

SQliteAdapter.prototype.prepareInsertion = function(attrs) {
  var columns = [];
  var values  = [];
  Object.getOwnPropertyNames(attrs).forEach(function(attr) {
    columns.push(attr);
    values.push(attrs[attr]);
  });
  return '(' + columns.join(',') + ') VALUES (\'' + values.join('\',\'') + '\')';
};

module.exports = SQliteAdapter;
