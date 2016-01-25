'use strict';

var sqlite3 = require('sqlite3').verbose()
  , appConfig = require('config/application')
  , db = new sqlite3.cached.Database('db/' + appConfig.database + '.sqlite')
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
  });
};

SQliteAdapter.prototype.exec = function(query) {
  return new Q.promise(function(resolve, reject) {
    db.serialize(function() {
      db.exec(query, function(err, _) {
        if(err) reject(err);
        resolve({exec: 'success'});
      });
    });
  });
};

SQliteAdapter.prototype.deleteDB = function() {
  var _self = this;
  return this.all('SELECT name FROM sqlite_master WHERE type=\'table\'').then(function(tables) {
    return tables.filter(function(table) {
      if(table.name !== 'sqlite_sequence')
        return table;
    });
  }).then(function(tables) {
    return tables.forEach(function(table) {
      _self.exec('DELETE FROM ' + table.name).then(function(res) {
        return res;
      });
    });
  }).then(function() {
    return _self.exec('VACUUM').then(function(res) {
      return res;
    });
  }).catch(function(err) {
    console.log(err.stack);
  });
};

SQliteAdapter.prototype.validateAttrs = function(attrs, projectionAttrs) {
  var valid = false;

  if (attrs !== undefined && attrs !== null) {
    if(Object.getOwnPropertyNames(attrs).length > 0) {
      var invalidAttrs = Object.getOwnPropertyNames(attrs).filter(function(attr) {
        return this.schemaAttrs.indexOf(attr) < 0;
      }, this);
      if(invalidAttrs.length === 0)
        valid = true;
    }
  }

  if (projectionAttrs !== undefined && projectionAttrs !== null) {
    if(projectionAttrs.length > 0) {
      var invalidAttrs = projectionAttrs.filter(function(attr) {
        return this.schemaAttrs.indexOf(attr) < 0;
      }, this);
      if(invalidAttrs.length === 0)
        valid = true;
    } else {
      valid = false;
    }
  }

  return valid;
};

SQliteAdapter.prototype.selection = function(attrs) {
  var selectionAttrs = Object.getOwnPropertyNames(attrs).map(function(attr) {
    return (attr + ' = ' + attrs[attr]);
  }).join(' AND ');
  return 'WHERE ' + selectionAttrs;
};

SQliteAdapter.prototype.projection = function(attrs) {
  return attrs ? attrs.join(',') : '*';
};

SQliteAdapter.prototype.insertion = function(attrs) {
  var columns = [];
  var values  = [];
  Object.getOwnPropertyNames(attrs).forEach(function(attr) {
    columns.push(attr);
    values.push(attrs[attr]);
  });
  return '(' + columns.join(',') + ') VALUES (\'' + values.join('\',\'') + '\')';
};

module.exports = SQliteAdapter;
