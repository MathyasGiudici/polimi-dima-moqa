<template>
  <view class="container">

    <map-view class="maps" ref="map" :initial-region="currentPositionCoordinates" >
      <!-- Arduino data -->
      <Circle v-for="circle in arduinoData" :center="circle.center" :radius="circle.radius"
        fillColor="rgba(0, 0, 255, .5)" strokeColor="rgba(0,0,0,.2)"
        zIndex="2" strokeWidth="2"/>

      <!-- Arpa data -->
      <Circle v-for="circle in arpaData" :center="circle.center" :radius="circle.radius"
        fillColor="rgba(255, 0, 0, .5)" strokeColor="rgba(0,0,0,.2)"
        zIndex="2" strokeWidth="2"/>
    </map-view>

    <!-- Filter Button -->
    <view class="buttonContainer">
      <touchable-opacity class="bubbleBotton" :on-press="showDetails">
        <icon name="filter-outline" color="white" size="25"/>
        <text class="buttonText">Filter</text>
      </touchable-opacity>
      <touchable-opacity class="bubbleBotton-small" :on-press="refresh" v-if="!isLoading">
        <icon name="refresh" color="white" size="25"/>
      </touchable-opacity>
      <view class="bubbleBotton-small" v-if="isLoading">
        <activity-indicator size="small" color="white" />
      </view>
    </view>
  </view>
</template>

<script>
import MapView, {Circle} from "react-native-maps";
import * as React from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import * as utils from '../utils/MapsUtils';

import store from '../store';
import { EventRegister } from 'react-native-event-listeners';

export default {
    props: {
      navigation: { type: Object }
    },
    components: {
      MapView, Circle, Icon
    },
    data: function() {
    return {
      isLoading: false,
      arduinoData: [],
      arpaData: [],
      get currentPositionCoordinates() {
        return {
          latitude: this.curPos.latitude,
          longitude: this.curPos.longitude,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        };
      },
      curPos: {
        latitude: 45.474098205566399,
        longitude: 9.2347803115844709,
      },
    };
  },
  beforeMount: async function(){
    this.refresh();
  },
  mounted: function(){
    // listener for the page focus
    this.willFocusListener = this.navigation.addListener('willFocus',() =>{
      return this.refresh();
    });

    // listener to auto-fetch
    this.listener = EventRegister.addEventListener('blobArduinoDataUpdate',(data)=>{
      // Checking if the screen is isFocused to update
      if(this.navigation.isFocused())
        return this.refresh();
    });
  },
  beforeDestroy: function(){
    // Removing listeners
    this.willFocusListener.remove();
    EventRegister.removeEventListener(this.listener);
  },
  methods: {
    showDetails: function(){
      this.navigation.navigate('FilterParametersScreen',{ option: 'maps', onGoBack: () => this.refresh(),});
    },
    updateMap(curPos) {
      if(this.$refs.map == null || this.$refs.map == undefined){
        console.log("Map attribute is null");
      } else {
          this.$refs.map.animateCamera({ heading: 0, center: curPos, pitch: 0 });
          this.curPos = curPos;
      }
    },
    refresh: async function(){
      this.isLoading = true;
      // New chart data
      var generalPromise = new Promise(async function(resolve,reject){
        var result = await utils.getMapData(store.state.filter.maps);
        resolve(result);
      });

      var returnedObject = await generalPromise;

      // Data for the map
      this.arduinoData = returnedObject.arduino;
      this.arpaData = returnedObject.arpa;

      if(this.arduinoData.length != 0){
        this.updateMap({
          latitude: this.arduinoData[this.arduinoData.length - 1].center.latitude,
          longitude: this.arduinoData[this.arduinoData.length - 1].center.longitude,
        });
      } else{
        if(this.arpaData.length != 0){
          this.updateMap({
            latitude: this.arpaData[this.arpaData.length - 1].center.latitude,
            longitude: this.arpaData[this.arpaData.length - 1].center.longitude,
          });
        }
      }

      this.isLoading = false;
    }
  }
};
</script>
<style>
.container {
  flex: 1;
}

.maps{
  flex: 1;
  justify-content: flex-end;
  align-items: center;
}

.buttonContainer{
  margin: 5;
  flex-direction: row;
  background-color: transparent;
  align-self: center;
}

.bubbleBotton{
  flex-direction: row;
  background-color: rgba(0,122,255,1);
  margin-horizontal: 5;
  padding-horizontal: 15;
  padding-vertical: 15;
  border-radius: 20;
  width: 160;
  align-items: center;
  justify-content: center;
}

.bubbleBotton-small{
  flex-direction: row;
  background-color: rgba(0,122,255,1);
  margin-horizontal: 5;
  border-radius: 60;
  width: 50;
  align-items: center;
  justify-content: center;
}
.buttonText{
  text-align: center;
  font-size: 20;
  color: white;
}

</style>
