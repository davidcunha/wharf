'use strict';

module.exports = StatsFilters;

var moment = require('moment');

function StatsFilters(filter) {
  if(!moment(filter.uDate).isValid()) {
    throw new Error('Date ' + filter.uDate + ' is not a valid date');
  }

  return {
    applyBeforeFilter: function(selectionAttrs) {
      if(filter.filter === 'lastHour') {
        var lastDate = moment(filter.uDate).utc();
        var startDate = moment(filter.uDate).utc().subtract(1, 'days');
        selectionAttrs.timestamp_day = {between: [moment(startDate).format('YYYY-MM-DD'),
                                                  moment(lastDate).format('YYYY-MM-DD')]};
      }
    },
    applyAfterFilter: function(stats) {
      console.log(stats);
      return stats;
    }
  };
}
