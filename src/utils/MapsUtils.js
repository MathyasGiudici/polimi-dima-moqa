// Needed scripts
import store from '../store';
import {timerPromise} from './Utils';
import {getArpaData} from './DataUtils';

//["Temperature", "Humidity", "Pressure", "Altitude", "TVOCs", "eCO2", "PM0.5", "PM1", "PM2.5", "PM4", "PM10"]

export async function getMapData(filter){
  let dataPromise = new Promise(function(resolve,reject){
      let toReturn = { arduino: [], arpa: [],};
      switch (filter.pinnedMeasure) {
        case 'Temperature':
          toReturn = generalGet('weather',filter);
          break;
        case 'Humidity':
          toReturn = generalGet('weather',filter);
          break;
        case 'CO2':
          toReturn = { arduino: [], arpa: [],};
          break;
        case 'PM10':
          toReturn = generalGet('air',filter);
          break;
        default:
          toReturn = { arduino: [], arpa: [],};
      }

      resolve(toReturn);
    });

  let data = Promise.race([timerPromise(), dataPromise]);

  if(data == 'End Race') {
    return [];
  }
  else {
    return data;
  }
}

// Get weather data from ARPA dataset
async function generalGet(arpaType,filter){

  let generalPromise = new Promise(function(resolve,reject){
    // Getting arpa data
    resolve(getArpaData(arpaType,filter));
  });

  let result = await generalPromise;

  //Setting data for the graph
  return prepareToMap(null,result,arpaType,filter);
}

// Preparing the chart object of data
async function prepareToMap(arduinoData,arpaData,arpaType,filter){
  // Starting searching the station
  let generalPromise = new Promise(function(resolve,reject){
    // Getting pinned station
    resolve(store.state.blob['arpa_' + arpaType + 'Stations'][filter.pinnedStation]);
  });

  let station = await generalPromise;

  // Preparing return object
  var toReturn = {
    arduino: [{center: {latitude: 45.476099205566400,longitude: 9.2387804115844600,},radius: 100,}],
    arpa: [],
  };

  // Populating arpa array
  arpaData.forEach((item, i) => {
    toReturn.arpa.push({ center:
      { latitude: station.properties.lat,
        longitude: station.properties.lng,
      },
      radius: adjustValue(item.valore),
    });
  });

  return toReturn;
}

// Creating correct radius for the circle
function adjustValue(string){
  let len = string.length;
  let toAdd = 3 - len;
  let stringAlpha = "1";

  if(toAdd > 0){
    for(let i=0; i < toAdd; i++)
      stringAlpha.concat("0");
  }

  return parseInt(string)*parseInt(stringAlpha);
}
