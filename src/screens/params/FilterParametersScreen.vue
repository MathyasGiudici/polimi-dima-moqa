<template>
  <scroll-view class="mainContainer" :content-container-style="{contentContainer: {paddingVertical: 20}}">
    <!-- Initial padding -->
    <view class="paddingElement"></view>

    <!-- Pick Measures -->
    <touchable-opacity class="listElement" :on-press="changeMeasure">
      <text class="textListTitleElement">Pick Measure</text>
      <icon name="chevron-right" size="35" color="lightgrey"/>
    </touchable-opacity>

    <!-- Space -->
    <view class="paddingElement"></view>

    <!-- Start Date Picker -->
    <touchable-opacity class="listElement" :on-press="()=>{isStartDateVisible=!isStartDateVisible;}" v-if="!trackVisualization">
      <text class="textListTitleElement">Starting Date</text>
      <text class="textListElement">{{startDate.string}}</text>
    </touchable-opacity>
    <view class="subComponent" v-if="isStartDateVisible">
      <DateTimePicker :value="startDate.date" mode="datetime" display="default"
            :onChange="setStartDate" locale="gb-GB" />
    </view>
    <!-- End Date Picker -->
    <touchable-opacity class="listElement" :on-press="()=>{isEndDateVisible=!isEndDateVisible;}" v-if="!trackVisualization">
      <text class="textListTitleElement">End Date</text>
      <text class="textListElement">{{endDate.string}}</text>
    </touchable-opacity>
    <view class="subComponent" v-if="isEndDateVisible">
      <DateTimePicker :value="endDate.date" mode="datetime" display="default"
            :onChange="setEndDate" locale="gb-GB"/>
    </view>

    <!-- Warning -->
    <view class="warning" v-if="trackVisualization">
      <text class="textWarning">Starting Date and End Date are not available because you select to keep track of the data from the board</text>
    </view>

    <!-- ARPA toggle -->
    <touchable-opacity class="listElement">
      <text class="textListTitleElement">ARPA data</text>
      <view class="toggle">
        <switch :on-value-change = "changeArpaValue" :value = "arpaEnabled"/>
      </view>
    </touchable-opacity>

    <!-- Space -->
    <view class="paddingElement"></view>

    <!-- Pick Stations -->
    <touchable-opacity class="listElement" :on-press="changeStation" v-if="arpaEnabled">
      <text class="textListTitleElement">Pick Station</text>
      <icon name="chevron-right" size="35" color="lightgrey"/>
    </touchable-opacity>

  </scroll-view>
</template>

<script>
import store from '../../store';
// Utils for icon
import * as React from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// Utils for the date picker
import DateTimePicker from '@react-native-community/datetimepicker'
import {dateObjectCreator} from '../../utils/Utils';
var today = new Date();

export default {
  props: {
    navigation: { type: Object },
  },
  components: { Icon, DateTimePicker },
  data: function(){
    return {
      trackVisualization: store.state.arduino.trackVisualization,
      //Parameters related to measures
      pinnedMeasure: store.state.filter[this.navigation.state.params.option].pinnedMeasure,
      // Parameters related to date pickers
      isStartDateVisible: false,
      startDate: store.state.filter[this.navigation.state.params.option].startDate,
      isEndDateVisible: false,
      endDate: store.state.filter[this.navigation.state.params.option].endDate,
      //Arpa parameter
      arpaEnabled : store.state.filter[this.navigation.state.params.option].arpaEnabled,
      pinnedStation: store.state.filter[this.navigation.state.params.option].pinnedStation,
    };
  },
  mounted: function(){
    this.startDate = dateObjectCreator(new Date(store.state.filter[this.navigation.state.params.option].startDate.date));
    this.endDate = dateObjectCreator(new Date(store.state.filter[this.navigation.state.params.option].endDate.date));
  },
  methods: {
    changeMeasure: function(){
      this.navigation.navigate('FilterMeasuresPicker',{ pinnedMeasure: this.pinnedMeasure,
        onGoBack: (mea) => this.measuredPinned(mea),});
    },
    measuredPinned: function(mea){
      this.pinnedMeasure = mea;
      this.saveFilter();
      if(this.arpaEnabled)
        this.changeStation();
    },
    setStartDate: function(event,date){
      this.changeDate("startDate",date);
    },
    setEndDate: function(event,date){
      this.changeDate("endDate",date);
    },
    changeDate: function(target,date) {
      // Storing old value
      var stored = this[target];
      // Updating the value
      this[target] = dateObjectCreator(date);
      // Checking consistency
      var result = this.checkDateConsistency();

      if(result){
          this.saveFilter();
      } else{
        this[target] = stored;
      }
    },
    checkDateConsistency: function(){
      if(this.startDate.date > today){
        alert('Start date could not be in the future!');
        return false;
      }

      if(this.endDate.date > today){
        alert('End date could not be in the future!');
        return false;
      }

      if(this.startDate.date > this.endDate.date){
        alert('Start date could not be greater than end date!');
        return false;
      }

      return true;
    },
    changeArpaValue: function(){
      this.arpaEnabled = !this.arpaEnabled;
      if(this.arpaEnabled){
        this.changeStation();
      }
      else {
        this.saveFilter();
      }
    },
    changeStation: function(){
      this.navigation.navigate('FilterStationsPicker',{ pinnedMeasure: this.pinnedMeasure,
        pinnedStation: this.pinnedStation, onGoBack: (index) => this.returnFromChangeStation(index),});
    },
    returnFromChangeStation: function(index){
      this.pinnedStation = index;
      this.saveFilter();
    },
    saveFilter: function(){
      store.commit('changeFilterParameters', {targetFilter: this.navigation.state.params.option,
        newParameters:{
          pinnedMeasure: this.pinnedMeasure,
          startDate: this.startDate,
          endDate: this.endDate,
          arpaEnabled : this.arpaEnabled,
          pinnedStation: this.pinnedStation,
        }});
      store.commit('SAVE');
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
.textListTitleElement {
  padding-left: 10;
  font-size: 17;
}
.textListElement {
  padding-right: 5;
  font-size: 17;
  color: grey;
}
.toggle {
  padding-right: 5;
  color: rgba(0,122,255,1);
}
.subComponent{
  background-color: white;
}
.warning{
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
.textWarning{
  padding-left: 5;
  padding-right: 5;
  font-size: 17;
  text-align: left;
}
</style>
