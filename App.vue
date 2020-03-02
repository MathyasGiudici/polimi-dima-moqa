<template>
  <app-navigator></app-navigator>
</template>

<script>

import {
  createAppContainer,
  createBottomTabNavigator,
  createMaterialTopTabNavigator,
  createStackNavigator
} from "vue-native-router";

// Basic 4 screens
import HomeScreen from "./src/screens/HomeScreen.vue";
import MapsScreen from "./src/screens/MapsScreen.vue";
import ChartsScreen from "./src/screens/ChartsScreen.vue";
import SettingsScreen from "./src/screens/SettingsScreen.vue";

// Other screens
import DetailsScreen from "./src/screens/DetailsScreen.vue";

// Utils for icon
import * as React from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

// Navigator
const IOSTabs = createBottomTabNavigator(
  {
    Home: {
      screen: HomeScreen,
      navigationOptions: {
        tabBarLabel: 'Home',
        tabBarIcon: <Icon name="home-outline" size={25}/>
      },
    },
    Maps : {
      screen: MapsScreen,
      navigationOptions: {
        tabBarLabel: 'Maps',
        tabBarIcon: <Icon name="map-outline" size={25}/>
      }
    },
    Chart: {
      screen: ChartsScreen,
      navigationOptions: {
        tabBarLabel: 'Chart',
        tabBarIcon: <Icon name="chart-arc" size={25}/>
      }
    },
    Settings: {
      screen: createStackNavigator(
        {
          Home: {
            screen: SettingsScreen,
            navigationOptions: {
              headerShown : false,
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
          tabBarIcon: <Icon name="toolbox-outline" size={25}/>
        },
    },
  }
);

const AppNavigator = createAppContainer(IOSTabs);

import store from './src/store';

export default {
  components: { AppNavigator },
  beforeCreate: function(){
    store.commit("RESTORE");
  }
}
</script>
