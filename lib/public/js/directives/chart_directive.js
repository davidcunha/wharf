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
      type: '@'
    },
    template: '<canvas id="{{type}}-chart"></canvas>',
    link: function(scope, element) {
      if(element.length < 1) {
        throw new Error('ChartDirective element is empty');
      }

      var lineChart;
      var chartElement = element[0];

      scope.$watch('type', function() {
        var ctx = chartElement.getContext('2d');

        var data = {
          labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
          datasets: [
            {
              label: 'My First dataset',
              fillColor: 'rgba(220,220,220,0.2)',
              strokeColor: 'rgba(220,220,220,1)',
              pointColor: 'rgba(220,220,220,1)',
              pointStrokeColor: '#fff',
              pointHighlightFill: '#fff',
              pointHighlightStroke: 'rgba(220,220,220,1)',
              data: [65, 59, 80, 81, 56, 55, 40]
            }
          ]
        };

        lineChart = new ChartJs(ctx).Line(data);
      });

      scope.$on('$destroy', function() {
        lineChart.clear();
      });
    }
  };
}
