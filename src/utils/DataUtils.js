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

// Given a set of indexes (targets) return the stations
export function stationsFilter(stations,targets){
  var toReturn = [];

  if(stations == undefined)
    return [];

  stations.forEach((item, i) => {
    if(targets.includes(i)){
      toReturn.push(item);
    }
  });

  // console.log("stations size",toReturn.length);
  // console.log("stations",toReturn);
  return toReturn;
}

import {getHandler} from './Network';
// Given a set of stations returns the data of their sensor (only valid)
export async function dataFilter(url,station,startDate,endDate){
  // Mapping station to sensor
  var sensor = station.properties.idsensore;

  // Getting the data
  let promise =  new Promise(function(resolve, reject) {
    var data = [];
    getHandler(url+'?idsensore='+sensor,'', 'json').then((value) => {
      // Exploit result
      switch (value) {
        case 'End Race':
          break;
        case 'Connection problems':
          break;
        default:
          data = data.concat(value);
          resolve(data);
      }
    });
  });

  // Awaiting the promise
  var data = await promise;

  if(data.length == 0){
    return [ { idsensore: sensor,
              data:"1970-01-01T00:00:00.000",
              valore: "0"} ];
  }

  // Preparing the returning array
  var toReturn = [];

  // Looping on data to applay the filter
  data.forEach((item,i) => {
    // Checking validity of the datum and the date
    var date = new Date(item.data);
    if((item.stato == 'VA') && (startDate.date.getTime() <= date.getTime()) && (date.getTime() <= endDate.date.getTime())) {
        toReturn.push(item);
    }
  });

  // Auto sort by Date
  toReturn.sort(function(a, b){
    a_date = new Date(a.data);
    b_date = new Date(b.data);
    if(a_date.getTime() < b_date.getTime()) { return -1; }
    if(a_date.getTime() > b_date.getTime()) { return 1; }
    return 0;
  });

  // console.log("data size",toReturn.length);
  return toReturn;
}
