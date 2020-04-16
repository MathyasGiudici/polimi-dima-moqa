// Needed scripts
import store from '../store';
import {timerPromise, dateObjectCreator} from './Utils';
import {getArduinoData, getArpaData} from './DataUtils';

//["Temperature", "Humidity", "Pressure", "Altitude", "TVOCs", "eCO2", "PM0.5", "PM1", "PM2.5", "PM4", "PM10"]

export async function getMapData(filter){
  var dataPromise = new Promise(function(resolve,reject){
      var toReturn = { arduino: [], arpa: [],};
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

  var data = await Promise.race([timerPromise(), dataPromise]);

  if(data == 'End Race') {
    return [];
  }
  else {
    return data;
  }
}

// Get weather data from ARPA dataset
async function generalGet(arpaDataAvailable,arpaType,filter){
  // Creating a new filter to manage problem with live tracking
  var localFilter = JSON.parse(JSON.stringify(filter));

  // Changing automatically parametrrs to track live parameters
  if(store.state.arduino.trackVisualization){
    var midnight = new Date();
    midnight.setHours(0,0,0);
    localFilter.startDate = dateObjectCreator(midnight);
    localFilter.endDate = dateObjectCreator(new Date());
  }

  var generalPromise = new Promise(async function(resolve,reject){
    // Getting arduino data
    var arduino;

    // Mananging correct retrieve of live data
    if(store.state.arduino.trackVisualization){
      arduino = await store.state.blob.arduinoData;
    } else {
      arduino = await getArduinoData(arpaType,filter);
    }

    // Getting arpa data
    var arpa = [];
    if(arpaDataAvailable && filter.arpaEnabled)
      arpa = await getArpaData(arpaType,filter);

    resolve([arduino,arpa]);
  });

  var result = await generalPromise;

  //Setting data for the graph
  return prepareToMap(result[0],result[1],arpaDataAvailable, arpaType,filter);
}

// Preparing the chart object of data
async function prepareToMap(arduinoData,arpaData,arpaDataAvailable,arpaType,filter){
  // Preparing return object
  var toReturn = {
    arduino: [],
    arpa: [],
  };

  // Checking if
  if(arpaDataAvailable && filter.arpaEnabled) {
    // Starting searching the station
    var generalPromise = new Promise(async function(resolve,reject){
      // Getting pinned station
      var ret = await store.state.blob['arpa_' + arpaType + 'Stations'][filter.pinnedStation];
      resolve(ret);
    });

    var station = await generalPromise;

    // Populating arpa array with stations
    arpaData.forEach((item, i) => {
      toReturn.arpa.push({ center:
        { latitude: station.properties.lat,
          longitude: station.properties.lng,
        },
        radius: adjustValue(filter.pinnedMeasure,item.valore),
      });
    });
  }

  arduinoData.forEach((item, i) => {
    toReturn.arduino.push({ center:
      { latitude: item.latitude,
        longitude: item.longitude,
      },
      radius: adjustValue(filter.pinnedMeasure,item[filter.pinnedMeasure.replace(".","").toLowerCase()]),
    });
  });

  return toReturn;
}


const measures = ["Temperature", "Humidity", "Pressure", "Altitude", "TVOCs", "eCO2", "PM0.5", "PM1", "PM2.5", "PM4", "PM10"];
const max_v_mea = [   50,           100,       10000,       2000,     1187,    8192,    .5,      1,     2.5,     4,      10 ];
const min_v_mea = [  -25,             0,       90000,          0,        0,     400,    .3,     .3,      .3,    .3,      .3 ];

// Creating correct radius for the circle
function adjustValue(pinned, string){
  // Checking if there are some issue with the data
  if(string == null || string == undefined)
    return 0;

  var value = (parseFloat(string) - min_v_mea[measures.indexOf(pinned)])
    /(max_v_mea[measures.indexOf(pinned)] - min_v_mea[measures.indexOf(pinned)]);

  return Math.abs(value) * 10;
}
