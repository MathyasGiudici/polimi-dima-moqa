// Months list
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

// Function to create a specific object used in FilterParametersScreen.vue to manage the dates
export function dateObjectCreator(date){
  var obj = {
    date: date,
  }
  var string = date.getDate() + ' ' + months[date.getMonth()] + ' ' + date.getFullYear();
  obj.string = string
  return obj;
};

export function minimalDate(date){
  let d = date.date;
  var toRet = d.getDate() + '/' + (d.getMonth() + 1) + '/' + d.getFullYear() +
    " " + ("0" + d.getHours()).slice(-2)  + ":" + ("0" + d.getMinutes()).slice(-2) ;
  return toRet;
}

import store from '../store';
import {getHandler} from './Network';
import {getMilanStations} from './DataUtils';
// Function to load the data of weather and air quality
export function loadData(){
  if(store.state.blob.arduinoData == null){
    // Load Data from server
  }

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
      }
    });
  }

  // if(store.state.blob.arpa_weatherData == null){
  //   getHandler(store.state.settings.arpa.weather.dataUrl,'', 'json').then((value) => {
  //     // Exploit result
  //     switch (value) {
  //       case 'End Race':
  //         break;
  //       case 'Connection problems':
  //         break;
  //       default:
  //         store.commit('blobMutation', {key:'arpa_weatherData', value: value });
  //     }
  //   });
  // }

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
      }
    });
  }

  // if(store.state.blob.arpa_airData == null){
  //   getHandler(store.state.settings.arpa.air.dataUrl,'', 'json').then((value) => {
  //     // Exploit result
  //     switch (value) {
  //       case 'End Race':
  //         break;
  //       case 'Connection problems':
  //         break;
  //       default:
  //         store.commit('blobMutation', {key:'arpa_airData', value: value });
  //     }
  //   });
  // }
}
