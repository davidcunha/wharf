'use strict';

module.exports = ChartController;

var moment = require('moment');

function ChartController($scope, Stats) {
  var chartsType = $scope.$parent.chartsType;

  if(chartsType === undefined || chartsType === null) {
    throw new Error('chartsType is empty or does not exists');
  }

  /**
   * There is one chart per stats type
   * This will associate each chart type with a chart controller,
   * if type was not already associated
  */
  chartsType.every(function(chart, index) {
    if(chart.enabled === false) {
      chartsType[index].enabled = true;
      $scope.type = chart.type;
      return false;
    }
    return true;
  });

  var uDate = moment().format();
  console.log(uDate);

  /**
   * Initialize stats based on chart type
   * Fetch stats data
  */
  Stats.query($scope.type, {container_name: $scope.$parent.selectedContainerName, filter: 'lastHour', ud: uDate}).then(function(statsData) {
    console.log(statsData);
  }).catch(function(err) {
    console.log(err);
  });

  var labels = [];
  var values = [];
  for(var i=0; i < 60; i++) {
    labels[i] = i;
    values[i] = Math.floor(Math.random() * (60 - 5));
  }



  $scope.dataSource = function() {
    return {
      labels: labels,
      datasets: [
        {
          label: 'My First dataset',
          fillColor: 'rgba(220,220,220,0.2)',
          strokeColor: 'rgba(220,220,220,1)',
          pointColor: 'rgba(220,220,220,1)',
          pointStrokeColor: '#fff',
          pointHighlightFill: '#fff',
          pointHighlightStroke: 'rgba(220,220,220,1)',
          data: values
        }
      ]
    };
  };
}
