<template>
  <view class="container">
    <!-- Status bar -->
    <status-bar bar-style="dark-content" />
    <!-- Scroll Container -->
    <scroll-view class="scroll-container" :content-container-style="{contentContainer: {paddingVertical: 20}}">
      <!-- Big Space -->
      <view class="paddingElementBig"></view>
      <view class="paddingElementSmall"></view>

      <!-- Title -->
      <text class="heading">Arduino Data</text>

      <!-- All the data -->
      <view class="row">
        <text class="row-element-title">Temperature</text>
        <text class="row-element-text">{{data.temperature}} °C</text>
      </view>
      <view class="row">
        <text class="row-element-title">Relative Humidity</text>
        <text class="row-element-text">{{data.humidity}} %</text>
      </view>
      <view class="row">
        <text class="row-element-title">Pressure</text>
        <text class="row-element-text">{{data.pressure}} Pa</text>
      </view>
      <view class="row">
        <text class="row-element-title">Altitude</text>
        <text class="row-element-text">{{data.altitude}} m</text>
      </view>
      <view class="row">
        <text class="row-element-title">TVOCs</text>
        <text class="row-element-text">{{data.tvocs}} ppb</text>
      </view>
      <view class="row">
        <text class="row-element-title">eCO2</text>
        <text class="row-element-text">{{data.eco2}} ppm</text>
      </view>
      <view class="row">
        <text class="row-element-title">PM0.5</text>
        <text class="row-element-text">{{data.pm05}} μm</text>
      </view>
      <view class="row">
        <text class="row-element-title">PM1</text>
        <text class="row-element-text">{{data.pm1}} μm</text>
      </view>
      <view class="row">
        <text class="row-element-title">PM2.5</text>
        <text class="row-element-text">{{data.pm25}} μm</text>
      </view>
      <view class="row">
        <text class="row-element-title">PM4</text>
        <text class="row-element-text">{{data.pm4}} μm</text>
      </view>
      <view class="row">
        <text class="row-element-title">PM10</text>
        <text class="row-element-text">{{data.pm10}} μm</text>
      </view>

      <!-- Big Space -->
      <view class="paddingElementBig"></view>
      <!-- Button for recording -->
      <touchable-opacity class="bubbleBotton" :on-press="startRecording" v-if="!isRecording">
        <icon name="radiobox-marked" color="white" size="25" style="padding-right:3;"/>
        <text class="buttonText" style="padding-left:3;">Start recording</text>
      </touchable-opacity>
      <touchable-opacity class="bubbleBotton" style="background-color: rgba(255,59,48,1);" :on-press="stopRecording" v-if="isRecording">
        <icon name="radiobox-marked" color="white" size="25" style="padding-right:3;"/>
        <text class="buttonText" style="padding-left:3;">Stop recording</text>
      </touchable-opacity>

      <!-- Little space -->
      <view class="paddingElementSmall"></view>
      <!-- Download latest data -->
      <touchable-opacity class="bubbleBotton" :on-press="fetchDataHandler" v-if="!isInAutoFetch">
        <icon name="download" color="white" size="25" style="padding-right:3;"/>
        <text class="buttonText" style="padding-left:3;">Fetch data</text>
      </touchable-opacity>
      <view class="bubbleBotton" style="background-color: grey;" v-if="isInAutoFetch">
        <icon name="download" color="white" size="25" style="padding-right:3;"/>
        <text class="buttonText" style="padding-left:3;">Fetch data</text>
      </view>

      <!-- Little Space -->
      <view class="paddingElementSmall"></view>
      <!-- Toggle -->
      <view class="row">
        <view class="toggle">
          <switch :on-value-change = "isInAutoFetchHandler" :value = "isInAutoFetch"/>
        </view>
        <text class="toggle-text">Auto-fetch data</text>
      </view>
      <!-- Toggle -->
      <view class="row">
        <view class="toggle">
          <switch :on-value-change = "trackVisualizationHanler" :value = "trackVisualization"/>
        </view>
        <text class="toggle-text">Visualize live data</text>
      </view>

    </scroll-view>
  </view>
</template>

<script>
import * as React from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import store from '../store';
import {arduinoDataParser} from '../utils/Utils'
import {getHandler} from '../utils/Network';
import {sendData} from '../utils/Network4Server';

import { EventRegister } from 'react-native-event-listeners';

export default {
  components: {
    Icon
  },
  data: function() {
    return {
      data: {
        temperature: '--',
        humidity: '--',
        pressure: '--',
        altitude: '--',
        tvocs: '--',
        eco2: '--',
        pm05: '--',
        pm1: '--',
        pm25: '--',
        pm4: '--',
        pm10: '--',
      },
      isRecording: false,
      isInAutoFetch: false,
      trackVisualization: store.state.arduino.trackVisualization,
      autoFetchRoutine: null,
    };
  },
  methods:{
    startRecording: function(){
      getHandler(store.state.settings.server.ip, store.state.settings.server.port, 'text').then((value) => {
        // Exploit result
        switch (value) {
          case 'End Race':
            alert('There are some problems in the connection with the server.\nThe recording could not start!');
            break;
          case 'Connection problems':
            alert('There are some problems in the connection with the server.\nThe recording could not start!');
            break;
          default:
            this.isRecording = !this.isRecording;
        }
      });
    },
    stopRecording: function(){
      // Change of the status
      this.isRecording = !this.isRecording;
    },
    isInAutoFetchHandler: async function(){
      if(this.isInAutoFetch){
        if(this.autoFetchRoutine != null) {
          // Clearing the auto fetch routine routine
          clearInterval(this.autoFetchRoutine);
          this.autoFetchRoutine = null;
          store.commit('blobMutation', {key:'arduinoGetterRoutine', value: null });
        }
      } else {
        // Trying first time with the board
        var result = await this.fetchData();

        // Checking if the board is connected
        if(result == 1)
          return;

        // Cleaning the data in the local array
        store.commit('blobArduinoDataClear');

        // Starting the routine to get the data
        this.autoFetchRoutine = setInterval(() => {
  	       this.fetchData();
         }, 1000);
      }

      // Saving the reference
      store.commit('blobMutation', {key:'arduinoGetterRoutine', value: this.autoFetchRoutine });

      // Changing the toggle status
      this.isInAutoFetch = !this.isInAutoFetch;
    },
    fetchDataHandler: function(){
      // Cleaning the data in the local array
      store.commit('blobArduinoDataClear');
      // Calling the fetch function
      this.fetchData();
    },
    fetchData: async function(){
      return getHandler(store.state.settings.wifi.ip, store.state.settings.wifi.port, 'text').then((value) => {
        var status = 1;
        // Exploit result
        switch (value) {
          case 'End Race':
            alert('There are some problems in the connection with the board.');
            break;
          case 'Connection problems':
            alert('There are some problems in the connection with the board.');
            break;
          default:
            // Real update of values
            this.updateValues(value);
            // Changing returned value
            status = 0;
        }
        return status;
      });
    },
    updateValues: function(response){
      // Onject
      var sample = arduinoDataParser(response);
      // Creating data object keys
      var keys = Object.keys(this.data);

      // Looping on keys to update the values
      keys.forEach((item, i) => {
        this.data[item] = sample[item];
      });

      // If need add to local array
      if(this.trackVisualization){
        // Adding new element
        store.commit('blobArduinoDataAdd',sample);
        // Emitting event to update map and chart
        EventRegister.emit('blobArduinoDataUpdate','');
      }

      // If we have to send to the server
      if(this.isRecording)
        this.sendToServer(response);
    },
    sendToServer: function(arduinoString){
      sendData(arduinoString);
    },
    trackVisualizationHanler: function(){
      // Updating value
      this.trackVisualization = !this.trackVisualization;
      store.commit('changeTrackVisualization',this.trackVisualization);

      // Emitting event to update map and chart
      EventRegister.emit('blobArduinoDataUpdate','');
    }
  }
}

</script>

<style>
.container {
  align-items: center;
  justify-content: center;
  flex: 1;
}
.scroll-container {
}
.heading {
  font-size: 34;
  font-weight: bold;
  margin: 20;
  align-self: center;
}
.paddingElementBig {
  height: 40;
}
.paddingElementSmall {
  height: 10;
}
.row {
  width: 100%;
  align-self: center;
  flex-direction: row;
  justify-content: center;
  padding-top: 7;
  padding-bottom: 7;
}
.row-element-title {
  width: 50%;
  padding-right: 5;
  font-size: 17;
  font-weight: 500;
  text-align: right;
}
.row-element-text {
  width: 50%;
  padding-left: 5;
  font-size: 17;
  text-align: left;
}
.bubbleBotton{
  align-self: center;
  flex-direction: row;
  background-color: rgba(0,122,255,1);
  padding-horizontal: 15;
  padding-vertical: 15;
  border-radius: 15;
  width: 200;
  align-items: center;
  justify-content: center;
}
.buttonText{
  text-align: center;
  font-size: 20;
  color: white;
}
.toggle {
  align-items: flex-end;
  width: 40%;
  padding: 5;
}
.toggle-text {
  width: 60%;
  padding: 5;
  font-size: 20;
}
</style>
