'use strict';

var sqlite3 = require('sqlite3').verbose()
  , appConfig = require('config/application')
  , db = new sqlite3.cached.Database('db/' + appConfig.database + '.sqlite')
  , Q = require('q');

var SQliteAdapter = function(tableName) {
  this.tableName = tableName;
};

var all = function(query) {
  return new Q.promise(function(resolve, reject) {
    db.serialize(function() {
      appConfig.logger.info(new Date().toISOString(), query);
      db.all(query, function(err, models) {
        if(err) reject(err);
        resolve(models);
      });
    });
  });
};

var exec = function(query) {
  return new Q.promise(function(resolve, reject) {
    db.serialize(function() {
      appConfig.logger.info(new Date().toISOString(), query);
      db.exec(query, function(err, _) {
        if(err) reject(err);
        resolve(_);
      });
    });
  });
};

var validateAttrs = function(attrs, projectionAttrs) {
  var valid = false;
  var invalidAttrs;

  if (attrs !== undefined && attrs !== null) {
    if(Object.keys(attrs).length > 0) {
      invalidAttrs = Object.keys(attrs).filter(function(attr) {
        return this.schemaAttrs.indexOf(attr) < 0;
      }, this);
      valid = (invalidAttrs.length === 0) ? true : false;
    }
  }

  if (Array.isArray(projectionAttrs) && projectionAttrs !== undefined && projectionAttrs !== null) {
    invalidAttrs = projectionAttrs.filter(function(attr) {
      return this.schemaAttrs.indexOf(attr) < 0;
    }, this);
    valid = (invalidAttrs.length === 0) ? true : false;
  }

  return valid;
};

var projection = function(attrs) {
  if(attrs.length > 0) {
    return attrs.join(',');
  } else {
    return '*';
  }
};

var insertion = function(attrs) {
  var columns = [];
  var values  = [];
  Object.keys(attrs).forEach(function(attr) {
    columns.push(attr);
    values.push(attrs[attr]);
  });
  return '(' + columns.join(',') + ') VALUES (\'' + values.join('\',\'') + '\')';
};

var selection = function(attrs) {
  var selectionAttrs = Object.keys(attrs).map(function(attr) {
    return (attr + ' = ' + '\'' + attrs[attr] + '\'');
  }).join(' AND ');
  return 'WHERE ' + selectionAttrs;
};

SQliteAdapter.prototype.create = function(attrs) {
  attrs = attrs || {};
  if(validateAttrs.call(this, attrs)) {
    var insertionAttrs = insertion(attrs);
    return exec('INSERT INTO ' + this.tableName + ' ' + insertionAttrs).then(function(res) {
      return res;
    }).catch(function(err) {
      appConfig.logger.error(err.stack);
    });
  } else {
    appConfig.logger.error('Invalid attributes: ', attrs);
  }
};

// TODO createBulk and wrap inside transaction for efficiency
SQliteAdapter.prototype.createBulk = function(modelsAttrs) {
  modelsAttrs = modelsAttrs || [{}];
  var validModelAttrs = modelsAttrs.every(function(attrs) {
    return validateAttrs.call(this, attrs);
  }, this);
  return validModelAttrs;
};

SQliteAdapter.prototype.delete = function(attrs) {
  attrs = attrs || {};
  if(validateAttrs.call(this, attrs)) {
    var selectionAttrs = selection(attrs);
    return exec('DELETE FROM ' + this.tableName + ' ' + selectionAttrs).then(function(res) {
      return res;
    }).catch(function(err) {
      appConfig.logger.error(err.stack);
    });
  } else {
    appConfig.logger.error('Invalid attributes: ', attrs);
  }
};

SQliteAdapter.prototype.find = function(attrs, projectionAttrs) {
  attrs = attrs || {};
  projectionAttrs = projectionAttrs || [];
  if(validateAttrs.call(this, attrs, projectionAttrs)) {
    var selectionAttrs = selection(attrs);
    projectionAttrs = projection(projectionAttrs);
    return all('SELECT ' + projectionAttrs + ' FROM ' + this.tableName + ' ' + selectionAttrs).then(function(models) {

      return (models.length > 0 ? models : undefined);
    }).catch(function(err) {
      appConfig.logger.error(err.stack);
    });
  } else {
    appConfig.logger.error('Invalid attributes: ', attrs);
  }
};

SQliteAdapter.prototype.findAll = function(projectionAttrs) {
  projectionAttrs = projectionAttrs || [];
  if(validateAttrs.call(this, null, projectionAttrs)) {
    projectionAttrs = projection(projectionAttrs);
    return all('SELECT ' + projectionAttrs + ' FROM ' + this.tableName).then(function(models) {
      return models;
    }).catch(function(err) {
      appConfig.logger.error(err.stack);
    });
  } else {
    appConfig.logger.error('Invalid attributes: ', projectionAttrs);
  }
};

SQliteAdapter.prototype.deleteDB = function() {
  return all('SELECT name FROM sqlite_master WHERE type=\'table\'').then(function(tables) {
    return tables.filter(function(table) {
      if(table.name !== 'sqlite_sequence')
        return table;
    });
  }).then(function(tables) {
    return tables.forEach(function(table) {
      exec('DELETE FROM ' + table.name).then(function(res) {
        return res;
      });
    });
  }).then(function() {
    return exec('VACUUM').then(function(res) {
      return res;
    });
  }).catch(function(err) {
    appConfig.logger.error(err.stack);
  });
};

module.exports = SQliteAdapter;
