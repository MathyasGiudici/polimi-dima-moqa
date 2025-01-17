// Import for manage the local storage
import * as storageHandler from './storageHandler'

// Local state functions
export function RESTORE (state){
  storageHandler.retrieveData();
}

export function SAVE (state){
  storageHandler.storeData(state);
}

export function DELETE(state){
  storageHandler.deleteDate();
}

export function REPLACE(state, obj){
  Object.keys(obj).forEach((item, i) => {
    state[item] = obj[item];
  });
}

export function changeTrackVisualization(state,value){
  state.arduino.trackVisualization = value;
}

// STATE "REAL" MUTATIONS
export function changeFilterParameters(state, {targetFilter, newParameters}){
  state.filter[targetFilter].pinnedMeasure = newParameters.pinnedMeasure;
  state.filter[targetFilter].startDate = newParameters.startDate;
  state.filter[targetFilter].endDate = newParameters.endDate ;
  state.filter[targetFilter].arpaEnabled = newParameters.arpaEnabled;
  state.filter[targetFilter].pinnedStation = newParameters.pinnedStation;
}

export function changeSettingParameter(state, {targetParameter, host, port}){
  state.settings[targetParameter].ip = host;
  state.settings[targetParameter].port = port;
}

export function changeArpaStationsUrl(state, {targetMeasure, url}){
  state.settings.arpa[targetMeasure].stationsUrl = url;
}

export function changeArpaPickedStations(state, {targetMeasure, picked}){
  state.settings.arpa[targetMeasure].pinnedStations = picked;
}

export function changeArpaDataUrl(state, {targetMeasure, url}){
  state.settings.arpa[targetMeasure].dataUrl = url;
}

export function changeUserData(state,user){
  var keys = Object.keys(user);

  // Looping on keys to update the values
  keys.forEach((item, i) => {
    state.user[item] = user[item];
  });
}

export function clearUserData(state){
  var keys = Object.keys(state.user);

  // Looping on keys to update the values
  keys.forEach((item, i) => {
    state.user[item] = '';
  });
}

export function blobMutation(state, {key, value}){
  state.blob[key] = value;
}

export function blobArduinoDataClear(state){
  state.blob.arduinoData = [];
}

export function blobArduinoDataAdd(state, object){
  state.blob.arduinoData.push(object);
}
