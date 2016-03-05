/* jshint browser: true */

'use strict';

module.exports = ChartDirective;

var ChartJs = require('chart.js');

function ChartDirective() {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      options: '@',
      type: '@',
      dataSource: '&source'
    },
    template: '<canvas id="{{type}}-chart"></canvas>',
    link: function(scope, element) {
      if(element.length < 1) {
        throw new Error('ChartDirective element is empty');
      }

      var lineChart;
      var chartElement = element[0];

      scope.$watch('type', function() {
        var dataSource = scope.dataSource();
        var ctx = chartElement.getContext('2d');
        lineChart = new ChartJs(ctx).Line(dataSource, {
          responsive: true
        });
      });

      scope.$on('$destroy', function() {
        lineChart.clear();
      });
    }
  };
}
