// Store
import store from '../store';
import {testDataSet} from './ChartsConstants';
import {stationsFilter, dataFilter} from './DataUtils';
import {dateObjectCreator,minimalDate} from './Utils';

const timerPromise = () => {
  return new Promise(function(resolve, reject) {
    setTimeout(resolve, 5000, 'End Race');});
};

export async function getChartData(pinnedMeasure,pinnedStation){
  //TODO: TEST
  let dataPromise = new Promise(function(resolve,reject){
      let toReturn = testDataSet;
      switch (pinnedMeasure) {
        case 'Temperature':
          toReturn = getArpaWeatherData(pinnedStation);
          break;
        case 'Humidity':
          toReturn = getArpaWeatherData(pinnedStation);
          break;
        case 'CO2':
          toReturn = testDataSet;
          break;
        case 'PM10':
          toReturn = getArpaAirData(pinnedStation);
          break;
        default:
          toReturn = testDataSet;
      }

      resolve(toReturn);
    });

  let chartData = Promise.race([timerPromise(), dataPromise]);

  if(chartData == 'End Race') {
    return testDataSet;
  }
  else {
    return chartData;
  }
}

// Get PM10 data from ARPA dataset
async function getArpaWeatherData(pinnedStation){
  var dataBlob = null;

  let generalPromise = new Promise(function(resolve,reject){
    resolve(store.state.blob.arpa_weatherStations[pinnedStation]);
  })
  .then((result)=>{
    // Setting result
    return new Promise(function(resolve,reject){
      resolve(dataFilter(store.state.settings.arpa.weather.dataUrl, result,
        store.state.filter.charts.startDate, store.state.filter.charts.endDate));
    });
  })
  .then((result)=>{
    // Setting data
    dataBlob = result;
  });

  await generalPromise;

  //Setting data for the graph
  return prepareToChart(null,dataBlob);
}

// Get PM10 data from ARPA dataset
async function getArpaAirData(pinnedStation){
  var dataBlob = null;

  let generalPromise = new Promise(function(resolve,reject){
    resolve(store.state.blob.arpa_airStations[pinnedStation]);
  })
  .then((result)=>{
    // Setting result
    return new Promise(function(resolve,reject){
      resolve(dataFilter(store.state.settings.arpa.air.dataUrl, result,
        store.state.filter.charts.startDate, store.state.filter.charts.endDate));
    });
  })
  .then((result)=>{
    // Setting data
    dataBlob = result;
  });

  await generalPromise;

  //Setting data for the graph
  return prepareToChart(null,dataBlob);
}

function prepareToChart(arduino,arpa){
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

  // Picking up Arpa data
  arpa.forEach((item, i) => {
    chart.labels.push(minimalDate(dateObjectCreator(new Date(item.data))));
    chart.datasets[0].data.push(0);
    chart.datasets[1].data.push(parseInt(item.valore));
  });

  // Deleting some labels to better view
  chart.labels.forEach((item, i) => {
    if( (i != 0) && (i != (chart.labels.length - 1)) && (i != Math.round((chart.labels.length - 1)/2)) ){
      chart.labels[i] = '';
    }
  });

  var toRet = [chart];
  toRet = toRet.concat(prepareToPercentile(chart));
  return toRet;
}

function prepareToPercentile(chartData){
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
  var arpaRet = [ arpa[Math.round((0.25 * arpa.length)-1) < 0 ? 0 : Math.round((0.25 * arpa.length)-1)],    // First quartile
                  arpa[Math.round((0.5 * arpa.length)-1)],     // Second quartile
                  arpa[Math.round((0.75 * arpa.length)-1)], ]; // Third quartile
  return [arduinoRet, arpaRet];
}
