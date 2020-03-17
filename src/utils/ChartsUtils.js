// Store
import store from '../store';
import {testDataSet} from './ChartsConstants';
import {stationsFilter, dataFilter} from './DataUtils';
import {dateObjectCreator,minimalDate} from './Utils';

const timerPromise = () => {
  return new Promise(function(resolve, reject) {
    setTimeout(resolve, 5000, 'End Race');});
};

export async function getChartData(pinnedMeasure){
  //TODO: TEST
  let dataPromise = new Promise(function(resolve,reject){
      let toReturn = testDataSet;
      switch (pinnedMeasure) {
        case 'Temperature':
          toReturn = getArpaTemperatureData();
          break;
        case 'Pressure':
          toReturn = testDataSet;
          break;
        case 'Humidity':
          toReturn = testDataSet;
          break;
        case 'CO2':
          toReturn = testDataSet;
          break;
        case 'PM10':
          toReturn = getArpaPM10Data();
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
async function getArpaTemperatureData(){
  var stations = null;
  var dataBlob = null;

  let generalPromise = new Promise(function(resolve,reject){
    resolve(stationsFilter(store.state.blob.arpa_weatherStations,
      store.state.settings.arpa.weather.pinnedStations));
  })
  .then((result)=>{
    // Setting result
    stations = result;
    return new Promise(function(resolve,reject){
      resolve(dataFilter(store.state.settings.arpa.weather.dataUrl, stations,
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
async function getArpaPM10Data(){
  var stations = null;
  var dataBlob = null;

  let generalPromise = new Promise(function(resolve,reject){
    resolve(stationsFilter(store.state.blob.arpa_airStations,
      store.state.settings.arpa.air.pinnedStations));
  })
  .then((result)=>{
    // Setting result
    stations = result;
    return new Promise(function(resolve,reject){
      resolve(dataFilter(store.state.settings.arpa.air.dataUrl, stations,
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

  arpa.forEach((item, i) => {
    chart.labels.push(minimalDate(dateObjectCreator(new Date(item.data))));
    chart.datasets[0].data.push(0);
    chart.datasets[1].data.push(parseInt(item.valore));
  });

  var toRet = [chart];
  toRet = toRet.concat(prepareToPercentile(chart));
  return toRet;
}

function prepareToPercentile(chartData){
  // Getting data
  var arduino = chartData.datasets[0].data;
  var arpa = chartData.datasets[1].data;

  // Sorting
  arduino = arduino.sort();
  arpa = arpa.sort();

  // Arrays
  var arduinoRet = [ arduino[Math.round((0.25 * arduino.length)-1)],    // First quartile
                     arduino[Math.round((0.5 * arduino.length)-1)],     // Second quartile
                     arduino[Math.round((0.75 * arduino.length)-1)], ]; // Third quartile
  var arpaRet = [ arpa[Math.round((0.25 * arpa.length)-1)],    // First quartile
                  arpa[Math.round((0.5 * arpa.length)-1)],     // Second quartile
                  arpa[Math.round((0.75 * arpa.length)-1)], ]; // Third quartile
  return [arduinoRet, arpaRet];
}
