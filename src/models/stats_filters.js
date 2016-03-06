'use strict';

module.exports = StatsFilters;

var moment = require('moment');

function StatsFilters() {
  return {
    applyPreFilter: function(filter, selectionAttrs) {
      if(!moment(filter.uDate).isValid()) {
        throw new Error('Date ' + filter.uDate + ' is not a valid date');
      }
      if(filter.filter === 'lastHour') {
        var lastDate = moment(filter.uDate).utc();
        var startDate = moment(filter.uDate).utc().subtract(1, 'days');
        selectionAttrs.timestamp_day = {between: [moment(startDate).format('YYYY-MM-DD'),
                                                  moment(lastDate).format('YYYY-MM-DD')]};
      }
    }
  };
}
