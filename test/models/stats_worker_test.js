// 'use strict';
//
// var StatsWorker = require('models/stats_worker')
//   , chai = require('chai')
//   , expect = chai.expect;
//
// describe('StatsWorker', function() {
//   describe('.constructor', function() {
//     it('returns error if entityName is missing', function() {
//       expect(function() { new StatsWorker() }).to.throw(Error, '\'entityName\' is undefined');
//     });
//
//     it('returns error if process is missing', function() {
//       expect(function() { new StatsWorker({entityName: 'entityName'}) }).to.throw(Error, '\'process\' is undefined');
//     });
//
//     it('returns a valid worker', function() {
//       expect(new StatsWorker({entityName: 'entityName', process: {}})).to.be.ok;
//     });
//   });
// });
