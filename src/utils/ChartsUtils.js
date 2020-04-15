// Needed scripts
import {testDataSet} from './ChartsConstants';
import {dateObjectCreator,minimalDate, timerPromise} from './Utils';
import {getArduinoData, getArpaData} from './DataUtils';
import {prepareToChart_arraySplitter} from './ChartsFunctionUtils';

export async function getChartData(filter){
  var dataPromise = new Promise(function(resolve,reject){
      var toReturn = testDataSet;
      switch (filter.pinnedMeasure) {
        case 'Temperature':
          toReturn = generalGet(true,'weather',filter);
          break;
        case 'Humidity':
          toReturn = generalGet(true,'weather',filter);
          break;
        case 'PM10':
          toReturn = generalGet(true,'air',filter);
          break;
        default:
          toReturn = generalGet(false,'',filter);
      }

      resolve(toReturn);
    });

  var chartData = Promise.race([timerPromise(), dataPromise]);

  if(chartData == 'End Race') {
    return testDataSet;
  }
  else {
    return chartData;
  }
}

// Get weather data from ARPA dataset
async function generalGet(arpaDataAvailable,arpaType,filter){

  var generalPromise = new Promise(async function(resolve,reject){
    // Getting arduino data
    var arduino = await getArduinoData(arpaType,filter);
    // Getting arpa data
    var arpa = [];
    if(arpaDataAvailable && filter.arpaEnabled)
      arpa = await getArpaData(arpaType,filter);

    resolve([arduino,arpa]);
  });

  var result = await generalPromise;

  //Setting data for the graph
  return prepareToChart(result[0],result[1],arpaDataAvailable,filter);
}

// Preparing the chart object of data
function prepareToChart(arduino,arpa,arpaDataAvailable,filter){
  // Starting object empty
  var chart = {
    labels: [],
    datasets: [{
      // arduino data
      data: [],
    },{
      // arpa data
      data: [],
      color: (opacity = 1) => `rgba(255, 0, 0, ${opacity})`
    }],
  };

  // Some array to arrange data before creating the
  // dataset for the chart
  var arduino_arranged = [];
  var arpa_arranged = [];

  // Arranging arduino data
  arduino.forEach((item, i) => {
    // New object
    var obj = {
      date: null,
      value: 0
    };
    // Getting data
    obj.date = new Date(item.timestamp);
    obj.value = parseFloat(item[filter.pinnedMeasure.replace(".","").toLowerCase()]);
    // Pushing in the array
    arduino_arranged.push(obj);
  });

  arpa.forEach((item, i) => {
    // New object
    var obj = {
      date: null,
      value: 0
    };
    // Getting data
    obj.date = new Date(item.data);
    obj.value = parseFloat(item.valore);
    // Pushing in the array
    arpa_arranged.push(obj);
  });

  // Checking the size of the arduino data array
  if(arduino_arranged.length != 0){
    // Checking if the arpa data are available
    if(arpaDataAvailable && filter.arpaEnabled && arpa_arranged.length != 0) {
      // Putting arpa value in the graph
      prepareToChart_arraySplitter(arduino_arranged,arpa_arranged,
        chart.datasets[0].data, chart.datasets[1].data, chart.labels);
    } else {
      // Putting a value to chart library problem error
      chart.datasets[1].data.push(0);

      // Putting arduino data
      arduino_arranged.forEach((item, i) => {
        chart.labels.push(minimalDate(dateObjectCreator(item.date)));
        chart.datasets[0].data.push(item.value);
      });
    }
  } else {
    // Putting a value to chart library problem error
    chart.datasets[0].data.push(0);

    // Checking if the arpa data are available
    if(arpaDataAvailable && filter.arpaEnabled && arpa_arranged.length != 0) {
      // Putting arpa value in the graph
      arpa_arranged.forEach((item, i) => {
        chart.labels.push(minimalDate(dateObjectCreator(item.date)));
        chart.datasets[1].data.push(item.value);
      });
    } else {
      // Putting a value to chart library problem error
      chart.datasets[1].data.push(0);
    }
  }

  // Deleting some labels to better view
  chart.labels.forEach((item, i) => {
    if( (i != 0) && (i != (chart.labels.length - 1)) && (i != Math.round((chart.labels.length - 1)/2)) ){
      chart.labels[i] = '';
    }
  });

  // Adding percentile for the response
  var toRet = [chart];
  toRet = toRet.concat(prepareToPercentile(arpaDataAvailable,chart));
  return toRet;
}

// Deviation computation
function prepareToPercentile(arpaDataAvailable,chartData){
  var arduino = [];
  var arpa = [];

  // Getting data and deep copy
  chartData.datasets[0].data.forEach((item, i) => {
    arduino.push(item);
  });

  chartData.datasets[1].data.forEach((item, i) => {
    arpa.push(item);
  });

  // Sorting
  arduino = arduino.sort(function(a,b){return a-b;});
  arpa = arpa.sort(function(a,b){return a-b;});

  // Arrays
  var arduinoRet = [ arduino[Math.round((0.25 * arduino.length)-1) < 0 ? 0 : Math.round((0.25 * arduino.length)-1)],    // First quartile
                     arduino[Math.round((0.5 * arduino.length)-1)],     // Second quartile
                     arduino[Math.round((0.75 * arduino.length)-1)], ]; // Third quartile

  var arpaRet;
  if(arpaDataAvailable){
    arpaRet = [ arpa[Math.round((0.25 * arpa.length)-1) < 0 ? 0 : Math.round((0.25 * arpa.length)-1)],    // First quartile
                arpa[Math.round((0.5 * arpa.length)-1)],     // Second quartile
                arpa[Math.round((0.75 * arpa.length)-1)], ]; // Third quartile
  } else{
    arpaRet = [ '-',  // First quartile
                '-', // Second quartile
                '-', ]; // Third quartile
  }

  return [arduinoRet, arpaRet];
}
