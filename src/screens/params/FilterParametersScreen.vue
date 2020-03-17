<template>
  <scroll-view class="mainContainer" :content-container-style="{contentContainer: {paddingVertical: 20}}">
    <!-- Initial padding -->
    <view class="paddingElement"></view>

    <!-- Measure picker -->
    <touchable-opacity class="listElement" v-for="mea in measures" :key="mea" :on-press="() => {measuredPinned(mea)}">
      <text class="textListTitleElement" style="font-weight: normal;">{{mea}}</text>
      <icon class="toggle" name="check" size="35" color="black" v-if="pinnedMeasure == mea "/>
    </touchable-opacity>

    <view class="paddingElement"></view>

    <!-- Start Date Picker -->
    <touchable-opacity class="listElement" :on-press="()=>{isStartDateVisible=!isStartDateVisible; checkDateConsistency();}">
      <text class="textListTitleElement">Starting Date</text>
      <text class="textListElement">{{startDate.string}}</text>
    </touchable-opacity>
    <view class="subComponent" v-if="isStartDateVisible">
      <DateTimePicker :value="startDate.date" mode="date" display="default"
            :onChange="setStartDate" />
    </view>
    <!-- End Date Picker -->
    <touchable-opacity class="listElement" :on-press="()=>{isEndDateVisible=!isEndDateVisible; checkDateConsistency();}">
      <text class="textListTitleElement">End Date</text>
      <text class="textListElement">{{endDate.string}}</text>
    </touchable-opacity>
    <view class="subComponent" v-if="isEndDateVisible">
      <DateTimePicker :value="endDate.date" mode="date" display="default"
            :onChange="setEndDate" />
    </view>
    <!-- ARPA toggle -->
    <touchable-opacity class="listElement">
      <text class="textListTitleElement">ARPA data</text>
      <view class="toggle">
        <switch :on-value-change = "changeArpaValue" :value = "arpaEnabled"/>
      </view>
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
var yesterday = new Date(); // Today!
yesterday.setDate(today.getDate() - 1); // Yesterday!

export default {
  props: {
    navigation: { type: Object },
  },
  components: { Icon, DateTimePicker },
  data: function(){
    return {
      //Parameters related to measures
      pinnedMeasure: store.state.filter[this.navigation.state.params.option].pinnedMeasure,
      measures: ["Temperature","Pressure", "Humidity", "CO2", "PM10"],
      // Parameters related to date pickers
      isStartDateVisible: false,
      startDate: store.state.filter[this.navigation.state.params.option].startDate,
      isEndDateVisible: false,
      endDate: store.state.filter[this.navigation.state.params.option].endDate,
      //Arpa parameter
      arpaEnabled : store.state.filter[this.navigation.state.params.option].arpaEnabled,
    };
  },
  methods: {
    measuredPinned: function(mea){
      this.pinnedMeasure = mea;

      this.saveFilter();
    },
    setStartDate: function(event,date){
      this.startDate = dateObjectCreator(date);
    },
    setEndDate: function(event,date){
      this.endDate = dateObjectCreator(date);
    },
    checkDateConsistency: function(){
      if(this.startDate.date > today){
        this.startDate = dateObjectCreator(yesterday);
        alert('Start date could not be in the future!');
        return;
      }

      if(this.endDate.date > today){
        this.endDate = dateObjectCreator(today);
        alert('End date could not be in the future!');
        return;
      }

      if(this.startDate.date > this.endDate.date){
        this.startDate = dateObjectCreator(yesterday);
        this.endDate = dateObjectCreator(today);
        alert('Start date could not be greater than end date!');
        return;
      }

      this.saveFilter();
    },
    changeArpaValue: function(){
      this.arpaEnabled = !this.arpaEnabled;
      this.saveFilter();
    },
    saveFilter: function(){
      store.commit('changeFilterParameters', {targetFilter: this.navigation.state.params.option,
        newParameters:{
          pinnedMeasure: this.pinnedMeasure,
          startDate: this.startDate,
          endDate: this.endDate,
          arpaEnabled : this.arpaEnabled,
        }});
      store.commit('SAVE');
      this.navigation.state.params.onGoBack();
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
</style>
