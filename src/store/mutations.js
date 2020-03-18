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

export function blobMutation(state, {key, value}){
  state.blob[key] = value;
}
