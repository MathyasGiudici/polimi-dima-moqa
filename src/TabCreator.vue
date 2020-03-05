<template>
  <app-navigator></app-navigator>
</template>

<script>

// Router manager
import {
  createAppContainer,
  createBottomTabNavigator,
  createMaterialTopTabNavigator,
  createStackNavigator
} from "vue-native-router";

// Utils for icon
import * as React from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'


// Basic 4 screens
import HomeScreen from "./screens/HomeScreen.vue";
import MapsScreen from "./screens/MapsScreen.vue";
import ChartsScreen from "./screens/ChartsScreen.vue";
import SettingsScreen from "./screens/SettingsScreen.vue";

import ParametersScreen from "./screens/params/ParametersScreen.vue";

// Settings screens
import DetailsScreen from "./screens/settings/DetailsScreen.vue";



// Navigator
const BottomTabs = createBottomTabNavigator(
  {
    Home: {
      screen: HomeScreen,
      navigationOptions: {
        tabBarLabel: 'Home',
        tabBarIcon: ({tintColor}) => <Icon name="home-outline" color={tintColor} size={25}/>
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
          ParametersScreen: {
            screen: ParametersScreen,
            navigationOptions: {
              title: "Maps Parameters",
            },
          },
        }),
        navigationOptions: {
          tabBarLabel: 'Maps',
          tabBarIcon: ({tintColor}) => <Icon name="map-outline" color={tintColor} size={25}/>
        },
    },
    Chart: {
      screen: ChartsScreen,
      navigationOptions: {
        tabBarLabel: 'Chart',
        tabBarIcon: ({tintColor}) => <Icon name="chart-arc" color={tintColor} size={25}/>
      },
    },
    // {
    //   screen: createStackNavigator(
    //     {
    //       Home: {
    //         screen: ChartsScreen,
    //         navigationOptions: {
    //           title : 'Chart',
    //         }
    //       },
    //       ParametersScreen: {
    //         screen: ParametersScreen,
    //         navigationOptions: {
    //           title: "Chart Parameters",
    //         },
    //       },
    //     }),
    //     navigationOptions: {
    //       tabBarLabel: 'Chart',
    //       tabBarIcon: ({tintColor}) => <Icon name="chart-arc" color={tintColor} size={25}/>
    //     },
    // },
    Settings: {
      screen: createStackNavigator(
        {
          Home: {
            screen: SettingsScreen,
            navigationOptions: {
              title : 'Settings',
            }
          },
          Details: {
            screen: DetailsScreen,
            navigationOptions: {
              title: "More Details",
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

const AppNavigator = createAppContainer(BottomTabs);

import store from './store';

export default {
  components: { AppNavigator },
  beforeCreate: function(){
    store.commit("RESTORE");
  }
}
</script>
