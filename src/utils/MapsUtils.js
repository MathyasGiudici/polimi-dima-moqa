// Needed scripts
import store from '../store';
import {timerPromise} from './Utils';
import {getArduinoData, getArpaData} from './DataUtils';

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

  let generalPromise = new Promise(async function(resolve,reject){
    // Getting arduino data
    let arduino = await getArduinoData(arpaType,filter);
    // Getting arpa data
    let arpa = [];
    if(filter.arpaEnabled)
      arpa = await getArpaData(arpaType,filter);

    resolve([arduino,arpa]);
  });

  let result = await generalPromise;

  console.log(result);

  //Setting data for the graph
  return prepareToMap(result[0],result[1],arpaType,filter);
}

// Preparing the chart object of data
async function prepareToMap(arduinoData,arpaData,arpaType,filter){
  // Preparing return object
  var toReturn = {
    arduino: [],
    arpa: [],
  };

  // Checking if
  if(filter.arpaEnabled) {
    // Starting searching the station
    let generalPromise = new Promise(async function(resolve,reject){
      // Getting pinned station
      let ret = await store.state.blob['arpa_' + arpaType + 'Stations'][filter.pinnedStation];
      resolve(ret);
    });

    let station = await generalPromise;

    // Populating arpa array with stations
    arpaData.forEach((item, i) => {
      toReturn.arpa.push({ center:
        { latitude: station.properties.lat,
          longitude: station.properties.lng,
        },
        radius: adjustValue(item.valore),
      });
    });
  }

  arduinoData.forEach((item, i) => {
    toReturn.arduino.push({ center:
      { latitude: item.latitude,
        longitude: item.longitude,
      },
      radius: adjustValue(item[filter.pinnedMeasure.toLowerCase()]),
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

  return parseInt(string)*parseInt(stringAlpha)/2;
}
