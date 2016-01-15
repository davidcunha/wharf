var levelup = require('level'),
  Q = require('q');

var db = levelup('./mydb');

var LevelDB = function() {};

LevelDB.put = function(name, value) {
  var defer = Q.defer();
  db.put(name, value, function (err) {
    if (err) defer.reject(err);
    defer.resolve('ok: ' + name);
  });
  return defer.promise;
};

LevelDB.get = function(name) {
  var defer = Q.defer();
  db.get(name, function (err, value) {
    if (err) defer.reject(err);
    defer.resolve(value);
  });
  return defer.promise;
};

module.exports = LevelDB;
