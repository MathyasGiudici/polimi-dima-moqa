// Needed scripts
import store from '../store';
import {dateToTimeStamp} from './Utils';
import {getHandler} from './Network';
import {getData, getDataFiltered} from './Network4Server';

// Function to load the data of weather and air quality
async function loadData(){

  var weatherPromise = new Promise(async function(resolve, reject){
    if(store.state.blob.arpa_weatherStations == null){
      getHandler(store.state.settings.arpa.weather.stationsUrl,'', 'json').then((value) => {
        // Exploit result
        switch (value) {
          case 'End Race':
            break;
          case 'Connection problems':
            break;
          default:
            store.commit('blobMutation', {key:'arpa_weatherStations', value: getMilanStations(value) });
            resolve();
        }
      });
    }
    else{
      resolve();
    }
  });

  var airPromise = new Promise(function(resolve, reject){
    if(store.state.blob.arpa_airStations == null){
      getHandler(store.state.settings.arpa.air.stationsUrl,'', 'json').then((value) => {
        // Exploit result
        switch (value) {
          case 'End Race':
            break;
          case 'Connection problems':
            break;
          default:
            store.commit('blobMutation', {key:'arpa_airStations', value: getMilanStations(value) });
            resolve();
        }
      });
    }
    else{
      resolve();
    }
  });

  await Promise.all([weatherPromise, airPromise]);
}

// From the response of the openAPI of Regione Lombardia returns the Stations
function getMilanStations(responseObject){
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
function stationsFilter(stations,targets){
  var toReturn = [];

  if(stations == undefined || targets == undefined || targets.length == 0)
    return [];

  targets.forEach((item, i) => {
    if(stations[item] != undefined)
      toReturn.push(stations[item]);
  });

  return toReturn;
}

// Given a set of stations returns the data of their sensor (only valid)
async function dataFilter(url,station,startDate,endDate){
  // Mapping station to sensor
  var sensor = station.properties.idsensore;

  // Getting the data
  var promise =  new Promise(function(resolve, reject) {
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

  if(data == "End Race" || data == "Connection problems"){
    return [ { idsensore: sensor,
              data:"1970-01-01T00:00:00.000",
              valore: "0"} ];
  }

  // Preparing the returning array
  var toReturn = [];

  var start = new Date(startDate.date);
  var end = new Date(endDate.date);
  // Looping on data to applay the filter
  data.forEach((item,i) => {
    // Checking validity of the datum and the date
    var current = new Date(item.data);
    if((item.stato == 'VA') && (start.getTime() <= current.getTime()) && (current.getTime() <= end.getTime())) {
        toReturn.push(item);
    }
  });

  // Auto sort by Date
  toReturn.sort(function(a, b){
    var a_date = new Date(a.data);
    var b_date = new Date(b.data);
    if(a_date.getTime() < b_date.getTime()) { return -1; }
    if(a_date.getTime() > b_date.getTime()) { return 1; }
    return 0;
  });

  // console.log("data size",toReturn.length);
  return toReturn;
}

// Get data from ARPA dataset
// @param: arpaType means weather or air
// @param: filter used to select data
async function getArpaData(arpaType,filter){

  var generalPromise = new Promise(async function(resolve,reject){
    if(store.state.blob['arpa_' + arpaType + 'Stations'] == null){
      await loadData();
    }
    // Getting pinned station
    var ret = await store.state.blob['arpa_' + arpaType + 'Stations'][filter.pinnedStation];
    resolve(ret);
  })
  .then((result)=>{
    if (result == null)
      console.log('Something is not working');
    // Getting relative data
    return new Promise(async function(resolve,reject){
      var data = await dataFilter(store.state.settings.arpa[arpaType].dataUrl, result,
        filter.startDate, filter.endDate);
      resolve(data);
    });
  });

  var data = await generalPromise;
  return data;
}

async function getArduinoData(arpaType,filter){
  // Getting the data
  var promise =  new Promise(function(resolve, reject) {
    var data = [];
    // getDataFiltered(dateToTimeStamp(filter.startDate.date),dateToTimeStamp(filter.endDate.date)).then((value) => {
    getData("","").then((value) => {
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

  var result = await promise;

  return result;
}

export{ loadData, getMilanStations, stationsFilter, getArpaData, getArduinoData }
