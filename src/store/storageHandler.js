import {AsyncStorage} from 'react-native';
import store from './index';

const storageKey = '@MySuperStore';

// Function to store the state in the application local storage in the phone
export async function storeData(obj){
  try {
    // Saving
    await AsyncStorage.setItem(storageKey, JSON.stringify(obj));
    // DEBUG PURPOSE
    await AsyncStorage.getItem(storageKey).then((result) => {console.log("result:", result);});
  } catch (error) {
    // Error saving data
  }
}

// Function to get the state saved in the application local storage in the phone
export async function retrieveData(){
  try {
    await AsyncStorage.getItem(storageKey)
    .then((result) => {
      var obj = JSON.parse(result);
      store.commit('REPLACE',obj);
    });
  } catch (error) {
    // Error retrieving data
  }
}

// Function to delete the stored state
export async function deleteDate(){
  try {
    await AsyncStorage.removeItem(storageKey)
    .then((result) => {
      console.log(result);
    });
  } catch (error) {
    // Error retrieving data
  }
}
