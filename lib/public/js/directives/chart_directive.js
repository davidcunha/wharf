/* jshint browser: true */

'use strict';

module.exports = ChartDirective;

var Highcharts = require('highcharts');
require('highcharts/modules/exporting')(Highcharts);

function ChartDirective() {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      options: '@',
      type: '@'
    },
    link: function(scope, element) {
      if(element.length < 1) {
        throw new Error('ChartDirective element is empty');
      }

      var chartElement = element[0];

      Highcharts.chart(chartElement, {
      	xAxis: {
          categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
      	},
      	series: [{
      		data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4]
      	}]
      });
    }
  };
}
