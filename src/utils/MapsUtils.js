// Needed Scripts
import {getArpaData} from './DataUtils';

const timerPromise = () => {
  return new Promise(function(resolve, reject) {
    setTimeout(resolve, 5000, 'End Race');});
};

export async function getMapData(filter){
  let dataPromise = new Promise(function(resolve,reject){
      let toReturn = testDataSet;
      switch (filter.pinnedMeasure) {
        case 'Temperature':
          toReturn = generalGet('weather',filter);
          break;
        case 'Humidity':
          toReturn = generalGet('weather',filter);
          break;
        case 'CO2':
          toReturn = testDataSet;
          break;
        case 'PM10':
          toReturn = generalGet('air',filter);
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

// Get weather data from ARPA dataset
async function generalGet(arpaType,filter){

  let generalPromise = new Promise(function(resolve,reject){
    // Getting pinned station
    resolve(getArpaData(arpaType,filter));
  });

  let result = await generalPromise;

  //Setting data for the graph
  return prepareToMap(null,result);
}

// function to prepar the return object with data
function prepareToMap(arduino,arpa){
  // TODO
}
