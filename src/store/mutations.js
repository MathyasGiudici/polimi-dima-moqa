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
  state.filter[targetFilter].pinnedMeasures = newParameters.pinnedMeasures;
  state.filter[targetFilter].startDate = newParameters.startDate;
  state.filter[targetFilter].endDate = newParameters.endDate ;
  state.filter[targetFilter].arpaEnabled = newParameters.arpaEnabled;
}

export function changeSettingParameter(state, {targetParameter, host, port}){
  state.settings[targetParameter].ip = host;
  state.settings[targetParameter].port = port;
}
