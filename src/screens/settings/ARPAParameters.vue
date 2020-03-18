<template>
  <scroll-view class="mainContainer" :content-container-style="{contentContainer: {paddingVertical: 20}}" :onScrollEndDrag="()=>{checkStationConnection();checkDataConnection();}">
    <!-- Loading -->
    <view class="loading" v-if="isLoading" >
        <activity-indicator size="large" color="#lightgrey" />
    </view>
    <!-- Space -->
    <view class="paddingElement"></view>

    <!-- Stations Address -->
    <view class="listElement">
      <text class="textListTitleElement">Station URL</text>
      <text-input class="textListElement" placeholder="htpp://localhost" v-model="stationsUrl" :onChangeText="stationsUrlSetter" />
    </view>

    <!-- Stations Confirm Button -->
    <view class="listElement" style="justifyContent: space-around" v-if="changingStations">
      <button title="Make changes" :on-press="stationsUrlChange" />
    </view>

    <!-- Stations Connection Status -->
    <view class="listElement">
      <text class="textListTitleElement">Station Status</text>
      <view class="circle" :style="stationsUrlStatusStyle"></view>
    </view>

    <!-- Space -->
    <view class="paddingElement"></view>

    <!-- Pick Stations -->
    <touchable-opacity class="listElement" :on-press="pickStations" v-if="stationsAvailable">
      <text class="textListTitleElement">Pick Stations</text>
      <icon name="chevron-right" size="35" color="lightgrey"/>
    </touchable-opacity>

    <!-- Space -->
    <view class="paddingElement"></view>

    <!-- Data Address -->
    <view class="listElement">
      <text class="textListTitleElement">Data URL</text>
      <text-input class="textListElement" placeholder="htpp://localhost" v-model="dataUrl" :onChangeText="dataUrlSetter" />
    </view>

    <!-- Data Confirm Button -->
    <view class="listElement" style="justifyContent: space-around" v-if="changingData">
      <button title="Make changes" :on-press="dataUrlChange" />
    </view>

    <!-- Data Connection Status -->
    <view class="listElement">
      <text class="textListTitleElement">Data Status</text>
      <view class="circle" :style="dataStatusStyle"></view>
    </view>

    <!-- Space -->
    <view class="paddingElement"></view>

    <!-- Warning -->
    <view class="subComponent">
      <text class="textSubComponent">The urls that can currently be entered are related to the OpenData
        of Regione Lombardia (https://www.dati.lombardia.it/) as there is no single format for the OpenData </text>
    </view>

    <!-- Space -->
    <view class="paddingElement"></view>

  </scroll-view>
</template>

<script>
// Utils for icon
import * as React from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import store from '../../store';
import {getHandler} from '../../utils/Network';
import {getMilanStations} from '../../utils/DataUtils';

export default {
  props: {
    navigation: { type: Object },
  },
  components: {
    Icon
  },
  data: function(){
    return {
      isLoading: false,
      stationsUrl: store.state.settings.arpa[this.navigation.state.params.option.prop].stationsUrl,
      changingStations: false,
      stationsUrlStatusStyle: {
        backgroundColor: 'darkorange'
      },
      stationsAvailable: false,
      stations: null,
      dataUrl: store.state.settings.arpa[this.navigation.state.params.option.prop].dataUrl,
      changingData: false,
      dataStatusStyle: {
        backgroundColor: 'darkorange'
      },
    };
  },
  mounted: function(){
    this.checkStationConnection();
    this.checkDataConnection();
  },
  methods: {
    stationsUrlSetter: function(text){
      this.changingStations = true;
      this.stationsUrl = text;
    },
    dataUrlSetter: function(text){
      this.changingData = true;
      this.dataUrl = text;
    },
    checkStationConnection: function(){
      // Showing loading animation
      this.isLoading = true;

      getHandler(this.stationsUrl,'', 'json').then((value) => {
        // Stop loading motion
        this.isLoading = false;

        // Exploit result
        switch (value) {
          case 'End Race':
            this.stationsUrlStatusStyle = { backgroundColor: 'darkorange' };
            break;
          case 'Connection problems':
            this.stationsUrlStatusStyle = { backgroundColor: 'red' };
            break;
          default:
            this.stationsUrlStatusStyle = { backgroundColor: 'green' };
            this.stationsAvailable = true;
            this.stations = getMilanStations(value);
        }
      });
    },
    checkDataConnection: function(){
      // Showing loading animation
      this.isLoading = true;

      // Checking connection
      getHandler(this.dataUrl,'', 'json').then((value) => {
        // Stop loading animation
        this.isLoading = false;

        // Exploit result
        switch (value) {
          case 'End Race':
            this.dataStatusStyle = { backgroundColor: 'darkorange' };
            break;
          case 'Connection problems':
            this.dataStatusStyle = { backgroundColor: 'red' };
            break;
          default:
            this.dataStatusStyle = { backgroundColor: 'green' };
        }
      });
    },
    stationsUrlChange: function(){
      // Hiding confirmation button
      this.changingStations = false;
      // Hiding button to pin stations
      this.stationsAvailable = false;
      // Changing state
      store.commit('changeArpaStationsUrl', { targetMeasure: this.navigation.state.params.option.prop,
        url: this.stationsUrl });
      // Saving local new stations
      store.commit('blobMutation',
          {key:'arpa_'+ this.navigation.state.params.option.prop +'Stations', value: null });
      // Persistence station
      store.commit('SAVE');
      // Checking connection
      this.checkStationConnection();
    },
    dataUrlChange: function(){
      // Hiding confirmation button
      this.changingData = false;
      // Changing state
      store.commit('changeArpaDataUrl', { targetMeasure: this.navigation.state.params.option.prop,
        url: this.dataUrl });
      // Persistence station
      store.commit('SAVE');
      // Checking connection
      this.checkDataConnection();
    },
    pickStations: function(){
      // Calling navigator passing parameters+
      this.navigation.navigate("StationsPicker",{ option: this.navigation.state.params.option,
        stations: this.stations });
    }
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
.loading{
  flex: 1;
  justify-content: center;
  padding-top: 20;
}
.textListTitleElement {
  padding-left: 10;
  font-size: 17;
}
.textListElement {
  padding-right: 5;
  font-size: 17;
  text-align: right;
  color: grey;
}
.circle {
   margin-right: 5;
   height: 30;
   width: 30;
   border-radius: 15;
}
.subComponent{
  align-items: center;
  justify-content: space-between;
  width: 100%;
  background-color: white;
  borderStyle: solid;
  borderTopWidth: .3;
  borderTopColor: lightgrey;
  borderBottomWidth: .3;
  borderBottomColor: lightgrey;
  padding-top: 20;
  padding-bottom: 20;
  padding-left: 5;
  padding-right: 5;
}
.textSubComponent{
  padding-left: 5;
  padding-right: 5;
  font-size: 15;
  text-align: left;
}
</style>
