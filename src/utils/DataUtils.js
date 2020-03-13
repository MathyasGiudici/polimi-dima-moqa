// From the response of the openAPI of Regione Lombardia returns the Stations
export function getMilanStations(responseObject){
  var features = responseObject.features;
  var returned = [];

  // taking Milan stations
  features.forEach((station, i) => {
    if(station.properties.provincia == 'MI') // && station.properties.nomestazione.includes('Milano'))
      returned.push(station);
  });

  // If are weather data: change tipologia -> nometiposensore
  returned.forEach((station, i) => {
    if(station.properties.tipologia)
      station.properties.nometiposensore = station.properties.tipologia;
      delete station.properties.tipologia;
  });

  // Sorting stations by name
  returned.sort(function(a, b){
    if(a.properties.nomestazione < b.properties.nomestazione) { return -1; }
    if(a.properties.nomestazione > b.properties.nomestazione) { return 1; }
    return 0;
  });

  return returned;
}

import {getHandler} from './Network';
// Given a set of indexes (targets) return the stations
export function stationsFilter(stations,targets){
  var toReturn = [];

  stations.forEach((item, i) => {
    if(targets.includes(i)){
      toReturn.push(item);
    }
  });

  // console.log("stations size",toReturn.length);
  return toReturn;
}

// Given a set of stations returns the data of their sensor (only valid)
export async function dataFilter(url,stations,startDate,endDate){
  // Mapping station to sensor
  var sensors = stations.map(station => station.properties.idsensore);

  let promise =  new Promise(function(resolve, reject) {
    var data = [];
    sensors.forEach((item, i) => {
      getHandler(url+'?idsensore='+item,'', 'json').then((value) => {
        // Exploit result
        switch (value) {
          case 'End Race':
            break;
          case 'Connection problems':
            break;
          default:
            data = data.concat(value);
            if(i == (sensors.length-1)){
              resolve(data);
            }
        }
      });
    });
  });

  var data = await promise;

  var toReturn = [];

  // Looping on date
  data.forEach((item,i) => {
    // Checking validity of the datum and the date
    var date = new Date(item.data);
    if((item.stato == 'VA') && (startDate.date.getTime() <= date.getTime()) && (date.getTime() <= endDate.date.getTime())) {
        toReturn.push(item);
    }
  });

  // console.log("data size",toReturn.length);
  return toReturn;
}
