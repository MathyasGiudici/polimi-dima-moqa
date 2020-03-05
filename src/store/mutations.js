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
export function increment(state){
  state.count++
}

export function decrement(state){
  state.count--
}

export function blob(state){
  state.blob.test = 'here'
}