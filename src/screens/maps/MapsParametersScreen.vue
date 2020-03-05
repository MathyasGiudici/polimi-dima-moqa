<template>
  <view class="container">
    <!-- Measure picker -->
    <view class="test rowContainer">
      <view class="textContainer">
        <text class="title">Target Measure</text>
        <RNPickerSelect class="picker" :onValueChange="(value) => console.log(value)" :items="items" />
      </view>
    </view>
    <view class="spacer"></view>
    <!-- Dates picker -->
    <view class="rowContainer">
      <view class="textContainer">
        <text class="title">Starting Date</text>
        <text class="date">{{startDate.string}}</text>
      </view>
      <button title="Edit" :on-press="()=>{isStartDateVisible = !isStartDateVisible;}"/>
    </view>
    <view class="spacer"></view>
    <view class="rowContainer">
      <view class="textContainer">
        <text class="title">End Date</text>
        <text class="date">{{endDate.string}}</text>
      </view>
      <button title="Edit" :on-press="()=>{isEndDateVisible = !isEndDateVisible;}"/>
    </view>

    <!-- Date pickers -->
    <date-time-picker-modal :isVisible="isStartDateVisible" mode="date" :isDarkModeEnabled="colorScheme === 'dark'"
      :onConfirm="setStartDate" :onCancel="()=>{isStartDateVisible = !isStartDateVisible;}" />
    <date-time-picker-modal :isVisible="isEndDateVisible" mode="date" :isDarkModeEnabled="colorScheme === 'dark'"
      :onConfirm="setEndDate" :onCancel="()=>{isEndDateVisible = !isEndDateVisible;}" />
  </view>
</template>

<script>
// Utils for general picker
import RNPickerSelect from 'react-native-picker-select';

// Utils for the date picker
import DateTimePickerModal from "react-native-modal-datetime-picker";
import {Appearance} from 'react-native-appearance';
import {dateObjectCreator} from '../../utils/Utils';
var today = new Date();

export default {
components: { RNPickerSelect, DateTimePickerModal },
data: function(){
  return {
    items: [
                { label: 'Football', value: 'football' },
                { label: 'Baseball', value: 'baseball' },
                { label: 'Hockey', value: 'hockey' },
            ],
    // Parameters related to date pickers
    colorScheme: Appearance.getColorScheme(),
    isStartDateVisible: false,
    startDate: dateObjectCreator(today),
    isEndDateVisible: false,
    endDate: dateObjectCreator(today),
  };
},
methods: {
  setStartDate: function(value){
    this.startDate = dateObjectCreator(value);
    this.isStartDateVisible = !this.isStartDateVisible;
    return new Promise(resolve => setTimeout(() => resolve(), 500))
        .then(() => { this.checkDateConsistency(); });
  },
  setEndDate: function(value){
    this.endDate = dateObjectCreator(value);
    this.isEndDateVisible = !this.isEndDateVisible;
    return new Promise(resolve => setTimeout(() => resolve(), 500))
        .then(() => { this.checkDateConsistency(); });
  },
  checkDateConsistency: function(){
    if(this.startDate.date > today){
      this.startDate = dateObjectCreator(today);
      alert('Start date could not be in the future!');
      return;
    }

    if(this.endDate.date > today){
      this.endDate = dateObjectCreator(today);
      alert('End date could not be in the future!');
      return;
    }

    if(this.startDate.date > this.endDate.date){
      this.startDate = dateObjectCreator(today);
      this.endDate = dateObjectCreator(today);
      alert('Start date could not be greater than end date!');
      return;
    }
  }
}
};
</script>

<style>
.container{
  flex: 1;
  align-items: center;
  justify-content: center;
  padding: 20;
}

.rowContainer{
  width: 100%;
  height: 50;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
}

.textContainer{
  width: 80%;
  flex-direction: row;
  justify-content: space-around;
}

.title{
  width: 50%;
  font-size: 17;
  font-weight: bold;
  text-align: right;
}

.date {
  font-size: 17;
  text-align: left;
}

.spacer{
  height: 10;
}

</style>
