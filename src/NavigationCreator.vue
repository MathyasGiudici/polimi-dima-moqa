<template>
  <app-navigator />
</template>

<script>

// Router manager
import {
  createAppContainer,
  createBottomTabNavigator,
  createSwitchNavigator,
  createStackNavigator
} from "vue-native-router";

// Utils for icon
import * as React from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// Login and registration
import LoginScreen from "./screens/LoginScreen.vue";
import SingUpScreen from "./screens/SingUpScreen.vue";

// Basic 4 screens
import ArduinoScreen from "./screens/ArduinoScreen.vue";
import MapsScreen from "./screens/MapsScreen.vue";
import ChartsScreen from "./screens/ChartsScreen.vue";
import SettingsScreen from "./screens/SettingsScreen.vue";

// Filter screens
import FilterParametersScreen from "./screens/params/FilterParametersScreen.vue";
import FilterStationsPicker from "./screens/params/FilterStationsPicker.vue";
import FilterMeasuresPicker from "./screens/params/FilterMeasuresPicker.vue";

// Settings screens
import GeneralParameters from "./screens/settings/GeneralParameters.vue";
import UserParameters from "./screens/settings/UserParameters.vue";
import ARPAParameters from "./screens/settings/ARPAParameters.vue";
import StationsPicker from "./screens/settings/StationsPicker.vue";


// Navigator
const BottomTabs = createBottomTabNavigator(
  {
    Home: {
      screen: ArduinoScreen,
      navigationOptions: {
        tabBarLabel: 'Arduino',
        tabBarIcon: ({tintColor}) => <Icon name="chip" color={tintColor} size={25}/>
      },
    },
    Maps :
    {
      screen: createStackNavigator(
        {
          Home: {
            screen: MapsScreen,
            navigationOptions: {
              title : 'Maps',
            }
          },
          FilterParametersScreen: {
            screen: FilterParametersScreen,
            navigationOptions: {
              title: "Maps Parameters",
            },
          },
          FilterStationsPicker: {
            screen: FilterStationsPicker,
            navigationOptions: ({navigation}) => {
              return {
                title: "Stations Picker",
              };
            },
          },
          FilterMeasuresPicker: {
            screen: FilterMeasuresPicker,
            navigationOptions: ({navigation}) => {
              return {
                title: "Measures Picker",
              };
            },
          },
        }),
        navigationOptions: {
          tabBarLabel: 'Maps',
          tabBarIcon: ({tintColor}) => <Icon name="map-outline" color={tintColor} size={25}/>
        },
    },
    Chart: {
      screen: createStackNavigator(
        {
          Home: {
            screen: ChartsScreen,
            navigationOptions: {
              title : 'Chart',
            }
          },
          FilterParametersScreen: {
            screen: FilterParametersScreen,
            navigationOptions: {
              title: "Chart Parameters",
            },
          },
          FilterStationsPicker: {
            screen: FilterStationsPicker,
            navigationOptions: ({navigation}) => {
              return {
                title: "Stations Picker",
              };
            },
          },
          FilterMeasuresPicker: {
            screen: FilterMeasuresPicker,
            navigationOptions: ({navigation}) => {
              return {
                title: "Measures Picker",
              };
            },
          },
        }),
        navigationOptions: {
          tabBarLabel: 'Chart',
          tabBarIcon: ({tintColor}) => <Icon name="chart-arc" color={tintColor} size={25}/>
        },
    },
    Settings: {
      screen: createStackNavigator(
        {
          Home: {
            screen: SettingsScreen,
            navigationOptions: {
              title : 'Settings',
            }
          },
          GeneralParameters: {
            screen: GeneralParameters,
            navigationOptions: ({navigation}) => {
              return {
                title: `${navigation.state.params.option.title}`,
              };
            },
          },
          UserParameters: {
            screen: UserParameters,
            navigationOptions: ({navigation}) => {
              return {
                title: `${navigation.state.params.option.title}`,
              };
            },
          },
          ARPAParameters: {
            screen: ARPAParameters,
            navigationOptions: ({navigation}) => {
              return {
                title: `${navigation.state.params.option.title}`,
              };
            },
          },
          StationsPicker: {
            screen: StationsPicker,
            navigationOptions: ({navigation}) => {
              return {
                title: "Stations Picker",
              };
            },
          },
        }),
        navigationOptions: {
          tabBarLabel: 'Settings',
          tabBarIcon: ({tintColor}) => <Icon name="toolbox-outline" color={tintColor} size={25}/>
        },
    },
  }
);

const switchNavigator = createSwitchNavigator(
  {
    LoginScreen: LoginScreen,
    SingUpScreen: SingUpScreen,
    BottomTabs: BottomTabs,
  },
  {
    initialRouteName: 'LoginScreen',
  },
);

const AppNavigator = createAppContainer(switchNavigator);

import store from './store';
import {loadData} from './utils/DataUtils';

export default {
  components: { AppNavigator },
  beforeCreate: async function(){
    var loadingPromise = new Promise(async function(resolve,reject){
        // Loading past state from AsyncStorage
        await store.commit("RESTORE");
        // Loading ARPA data from remote
        await loadData();

        resolve("NavigatorCreator finished loading process");
    });

    // Awaiting loading promise
    var result = await loadingPromise;
  }
}
</script>
