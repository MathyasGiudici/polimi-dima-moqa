<template>
  <scroll-view class="mainContainer" :content-container-style="{contentContainer: {paddingVertical: 20}}">
    <!-- Space -->
    <view class="paddingElement"></view>

    <!-- Station picker -->
    <touchable-opacity class="listElement" v-for="station in stations" :key="stations.indexOf(station)" :on-press="() => {pinHandler(stations.indexOf(station))}">
      <view class="textListContainer">
        <text class="textListTitleElement" >{{station.properties.nomestazione}}</text>
      </view>
      <icon class="toggle" name="check" size="35" color="black" v-if="pinned == stations.indexOf(station)"/>
    </touchable-opacity>

    <!-- Space -->
    <view class="paddingElement"></view>

  </scroll-view>
</template>

<script>
import store from '../../store';
// Utils for icon
import * as React from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import {stationsFilter} from '../../utils/DataUtils';

export default {
  props: {
    navigation: { type: Object },
  },
  components: { Icon },
  data: function(){
    return {
      //Parameters related to measures
      pinned: 0,
      stations: [],
      stations_blob: null,
    };
  },
  mounted: function(){
    this.loader();
  },
  methods: {
    loader: function(){
      let stations = null;

      switch (this.navigation.state.params.pinnedMeasure) {
        case 'Temperature':
          // Getting weather or air stations
          stations = stationsFilter(store.state.blob.arpa_weatherStations,store.state.settings.arpa.weather.pinnedStations);
          // Filtering by Temperature
          stations.forEach((item, i) => {
          if(item.properties.nometiposensore == "Temperatura")
              this.stations.push(item);
          });
          this.stations_blob = store.state.blob.arpa_weatherStations;
          break;
        case 'Humidity':
          // Getting weather or air stations
          stations = stationsFilter(store.state.blob.arpa_weatherStations,store.state.settings.arpa.weather.pinnedStations);
          // Filtering by Humidity
          stations.forEach((item, i) => {
          if(item.properties.nometiposensore == "Umidità Relativa")
              this.stations.push(item);
          });
          this.stations_blob = store.state.blob.arpa_weatherStations;
          break;
        case 'CO2':

          break;
        case 'PM10':
          // Getting weather or air stations
          stations = stationsFilter(store.state.blob.arpa_airStations,store.state.settings.arpa.air.pinnedStations);
          // Filtering by Humidity
          stations.forEach((item, i) => {
          if(String(item.properties.nometiposensore).includes("PM10"))
              this.stations.push(item);
          });
          this.stations_blob = store.state.blob.arpa_airStations;
          break;
        default:
         this.stations_blob = [];
      }

      if(this.navigation.state.params.pinnedStation == -1){
        // Resetting the pinned station (new measure)
        this.pinHandler(0);
      } else{
        // Pinning the saved station
        this.stations.forEach((item, i) => {
          if (this.stations_blob[this.navigation.state.params.pinnedStation].properties.idsensore == item.properties.idsensore)
            this.pinHandler(i);
        });
      }
    },
    pinHandler: function(index){
      // Local pinner
      this.pinned = index;

      // Finding the index in the array
      for(let i=0; i < this.stations_blob.length; i++ ){
        if (this.stations_blob[i].properties.idsensore == this.stations[index].properties.idsensore)
          this.navigation.state.params.onGoBack(i);
      }
    },
  }
};
</script>

<style>
.mainContainer {
  background-color: rgb(242,242,247);
}
.listElement {
  flex: 1;
  flexDirection: row;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 50;
  background-color: white;
  borderStyle: solid;
  borderTopWidth: .3;
  borderTopColor: lightgrey;
  borderBottomWidth: .3;
  borderBottomColor: lightgrey;
  padding-left: 5;
  padding-right: 5;
}
.paddingElement {
  height: 40;
}
.textListContainer{
  flex-direction: column;
}
.textListTitleElement {
  padding-left: 10;
  font-size: 17;
}
.toggle {
  padding-right: 5;
  color: rgba(0,122,255,1);
}
.subComponent{
  background-color: white;
}
</style>
