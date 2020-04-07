<template>
  <view class="container">
    <status-bar bar-style="dark-content" />
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
      <touchable-opacity class="bubbleBotton" :on-press="fetchData" v-if="!autoFetch">
        <icon name="download" color="white" size="25" style="padding-right:3;"/>
        <text class="buttonText" style="padding-left:3;">Fetch data</text>
      </touchable-opacity>
      <view class="bubbleBotton" style="background-color: grey;" v-if="autoFetch">
        <icon name="download" color="white" size="25" style="padding-right:3;"/>
        <text class="buttonText" style="padding-left:3;">Fetch data</text>
      </view>

      <!-- Little Space -->
      <view class="paddingElementSmall"></view>
      <!-- Toggle -->
      <view class="row">
        <view class="toggle">
          <switch :on-value-change = "autoFetchHandler" :value = "autoFetch"/>
        </view>
        <text class="toggle">auto-fetch data</text>
      </view>

    </scroll-view>
  </view>
</template>

<script>
import * as React from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default {
  components: {
    Icon
  },
  data: function() {
    return {
      data: {
        temperature: '0',
        humidity: '0',
        pressure: '0',
        altitude: '0',
        tvocs: '0',
        eco2: '0',
        pm05: '0',
        pm1: '0',
        pm25: '0',
        pm4: '0',
        pm10: '0',
      },
      isRecording: false,
      autoFetch: false,
    };
  },
  methods:{
    startRecording: function(){
      // Change of the status
      this.isRecording = !this.isRecording;
    },
    stopRecording: function(){
      // Change of the status
      this.isRecording = !this.isRecording;
    },
    fetchData: function(){

    },
    autoFetchHandler: function(){
      // Change of the status
      this.autoFetch = !this.autoFetch;


    },
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
  padding: 5;
  font-size: 20;
}
</style>
