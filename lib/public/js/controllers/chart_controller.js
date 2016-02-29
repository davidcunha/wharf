'use strict';

module.exports = ChartController;

function ChartController($scope) {
  $scope.chart = 'chart';
  var charts = $scope.$parent.charts;

  // associated each chart controller with a chart type
  charts.every(function(chart, index) {
    if(chart.enabled === false) {
      charts[index].enabled = true;
      $scope.type = chart.type;
      return false;
    } else {
      return true;
    }
  });
}
