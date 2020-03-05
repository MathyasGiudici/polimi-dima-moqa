<template>
  <scroll-view class="mainContainer" :content-container-style="{contentContainer: {paddingVertical: 20}}">
    <!-- Initial padding -->
    <view class="paddingElement"></view>

    <!-- Measure picker -->
    <touchable-opacity class="listElement" v-for="mea in measures" :key="mea" :on-press="() => {measuredPinned(mea)}">
      <text class="textListTitleElement" style="font-weight: normal;">{{mea}}</text>
      <icon class="toggle" name="check" size="35" color="black" v-if="pinnedMeasures.includes(mea)"/>
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
        <switch :on-value-change = "()=>{arpaEnabled=!arpaEnabled;}" :value = "arpaEnabled"/>
      </view>
    </touchable-opacity>

  </scroll-view>
</template>

<script>
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
components: { Icon, DateTimePicker },
data: function(){
  return {
    //Parameters related to measures
    pinnedMeasures: ["Temperature"],
    measures: ["Temperature","Pressure", "Humidity", "PM10"],
    // Parameters related to date pickers
    isStartDateVisible: false,
    startDate: dateObjectCreator(yesterday),
    isEndDateVisible: false,
    endDate: dateObjectCreator(today),
    //Arpa parameter
    arpaEnabled : true,
  };
},
methods: {
  measuredPinned: function(mea){
    if(this.pinnedMeasures.includes(mea) && this.pinnedMeasures.length > 1)
      this.pinnedMeasures.splice(this.pinnedMeasures.indexOf(mea),1);
    else
      this.pinnedMeasures.push(mea);
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
  font-weight: 600;
}
.textListElement {
  padding-right: 5;
  font-size: 17;
}
.toggle {
  padding-right: 5;
}
.subComponent{
  background-color: white;
}
</style>
