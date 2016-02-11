'use strict';

module.exports = SQliteAdapter;

var sqlite3 = require('sqlite3').verbose()
  , appConfig = require('config/application')
  , db = new sqlite3.cached.Database('db/' + appConfig.database + '.sqlite')
  , Q = require('q');

function SQliteAdapter(options) {
  options = options || {};
  if(!options.tableName) { throw new Error('\'tableName\' is undefined'); }
  if(!options.schemaAttrs) { throw new Error('\'schemaAttrs\' is undefined'); }

  return {
    tableName: options.tableName,
    schemaAttrs: options.schemaAttrs,
    create: create,
    destroy: destroy,
    find: find,
    findAll: findAll,
    update: update
  };
}

var create = function create(attrs) {
  attrs = attrs || {};

  validateAttrs.call(this, [attrs]);

  var insertionAttrs = insertion(attrs);
  return exec('INSERT INTO ' + this.tableName + ' ' + insertionAttrs).then(function(res) {
    return res;
  });
};

var destroy = function(attrs) {
  attrs = attrs || {};

  validateAttrs.call(this, [attrs]);

  var selectionAttrs = selection(attrs);
  return exec('DELETE FROM ' + this.tableName + ' ' + selectionAttrs).then(function(res) {
    return res;
  });
};

var find = function(attrs, projectionAttrs) {
  attrs = attrs || {};
  projectionAttrs = projectionAttrs || [];

  validateAttrs.call(this, [attrs, projectionAttrs]);

  var selectionAttrs = selection(attrs);
  projectionAttrs = projection(projectionAttrs);
  return all('SELECT ' + projectionAttrs + ' FROM ' + this.tableName + ' ' + selectionAttrs).then(function(models) {
    return (models.length > 0 ? models[0] : undefined);
  });
};

var findAll = function(projectionAttrs) {
  projectionAttrs = projectionAttrs || [];

  validateAttrs.call(this, [projectionAttrs]);

  projectionAttrs = projection(projectionAttrs);
  return all('SELECT ' + projectionAttrs + ' FROM ' + this.tableName).then(function(models) {
    return models;
  });
};

var update = function(attrs, updatingAttrs) {
  attrs = attrs || {};
  updatingAttrs = updatingAttrs || {};

  validateAttrs.call(this, [attrs, updatingAttrs]);

  updatingAttrs = updating(attrs, updatingAttrs);
  return exec('UPDATE ' + this.tableName + ' SET ' + updatingAttrs).then(function(res) {
    return res;
  });
};

// helper functions

var validateAttrs = function(attrs) {
  var valid = false;
  var invalidAttrs;
  var self = this;

  if (attrs !== undefined && attrs !== null) {
    attrs.forEach(function(setOfAttrs) {
      if(!Array.isArray(setOfAttrs)) {
        setOfAttrs = Object.keys(setOfAttrs);
      }
      invalidAttrs = setOfAttrs.filter(function(attr) {
        return self.schemaAttrs.indexOf(attr) < 0;
      });
      valid = (invalidAttrs.length === 0) ? true : false;
    });
  }

  if(!valid) {
    appConfig.logger.error('Invalid attributes: ', attrs);
    throw new Error('Invalid attributes: ' + attrs);
  }
};

function projection(projectionAttrs) {
  projectionAttrs = projectionAttrs || [];
  if(projectionAttrs.length > 0) {
    return projectionAttrs.join(',');
  } else {
    return '*';
  }
}

function insertion(attrs) {
  var columns = [];
  var values  = [];
  Object.keys(attrs).forEach(function(attr) {
    columns.push(attr);
    values.push(attrs[attr]);
  });
  return '(' + columns.join(',') + ') VALUES (\'' + values.join('\',\'') + '\')';
}

function selection(selectionAttrs) {
  selectionAttrs = Object.keys(selectionAttrs).map(function(attr) {
    return (attr + ' = ' + '\'' + selectionAttrs[attr] + '\'');
  }).join(' AND ');
  return 'WHERE ' + selectionAttrs;
}

function updating(selectionAttrs, updatingAttrs) {
  selectionAttrs = selection(selectionAttrs);
  updatingAttrs = Object.keys(updatingAttrs).map(function(attr) {
    return (attr + ' = ' + '\'' + updatingAttrs[attr] + '\'');
  }).join(',');
  return updatingAttrs + ' ' + selectionAttrs;
}

function all(query) {
  return new Q.promise(function(resolve, reject) {
    db.serialize(function() {
      appConfig.logger.info(new Date().toISOString(), query);
      db.all(query, function(err, models) {
        if(err) reject(err);
        resolve(models);
      });
    });
  });
}

function exec(query) {
  return new Q.promise(function(resolve, reject) {
    db.serialize(function() {
      appConfig.logger.info(new Date().toISOString(), query);
      db.exec(query, function(err, _) {
        if(err) reject(err);
        resolve(_);
      });
    });
  });
}

// DB management functions

SQliteAdapter.createDB = function() {
  var schema = appConfig.schema;
  return exec(schema).then(function(res) {
    return res;
  }).catch(function(err) {
    appConfig.logger.error(err.stack);
  });
};

SQliteAdapter.deleteDB = function() {
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
