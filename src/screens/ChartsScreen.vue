<template>
    <scroll-view :content-container-style="{contentContainer: {paddingVertical: 20}}" :onScrollEndDrag="refresh">

      <!-- Loading -->
      <view class="loading" v-if="isLoading" >
        <view class="paddingElement"></view>
          <activity-indicator size="large" color="#lightgrey" />
      </view>

      <!-- Space -->
      <view class="paddingElement"></view>

      <!-- Graph -->
      <view class="container">
        <line-chart :data="chartData" :width="chartWidth" :height="chartHeight"
          :chartConfig="chartConfig" bezier/>
      </view>
      <!-- Keys of the Graph -->
      <view class="textContainer">
        <icon name="circle" color="grey" size="20"/>
        <text style="font-size: 17;"> Arduino Data</text>
      </view>
      <view class="textContainer">
        <icon name="circle" color="red" size="20"/>
        <text style="font-size: 17;"> ARPA Data </text>
      </view>

      <!-- Space -->
      <view class="paddingElement"></view>

      <!-- Table -->
      <view class="container">
        <Table :borderStyle="{borderWidth: 1, borderColor: 'lightgrey'}" >
          <Row :data="tableHead" :style="{ height: 40, backgroundColor: 'lightgrey',}"
          :textStyle="{ margin: 6, fontSize: 17 }"/>
          <Rows :data="tableData" :textStyle="{ margin: 6, fontSize: 17 }"/>
        </Table>
      </view>

      <!-- Space -->
      <view class="paddingElement"></view>

      <!-- Filter Button  -->
      <view class="buttonContainer">
        <touchable-opacity class="bubbleBotton" :on-press="showDetails">
          <icon name="filter-outline" color="white" size="25"/>
          <text class="buttonText">Filter</text>
        </touchable-opacity>
      </view>

    </scroll-view>
</template>

<script>
// Datat visualization utils from react-native
import { LineChart, StackedBarChart } from 'react-native-chart-kit';
import { Table, Row, Rows } from 'react-native-table-component';
import {Dimensions} from 'react-native';

// Utils for icon
import * as React from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// Charts constants
import {getChartConfigs, testDataSet} from '../utils/ChartsConstants';
import * as utils from '../utils/ChartsUtils';

import store from '../store';

export default {
    props: {
      navigation: { type: Object }
    },
    components: {
      LineChart, Table, Row, Rows, Icon, StackedBarChart
    },
    data: function() {
      return {
        isLoading: false,
        // Parameters related to graph
        chartWidth : Dimensions.get('window').width - 25,
        chartHeight : 250,
        chartConfig: getChartConfigs(),
        chartData: testDataSet,
        // Parameters
        tableHead: ["Quartiles", store.state.filter.charts.pinnedMeasure, "ARPA" ],
        tableData: [
          ['1st Quartile', "-", "-"],
          ['2nd Quartile', "-", "-"],
          ['3rd Quartile', "-", "-"],
        ],
      };
  },
  beforeMount: async function(){
    this.refresh();
  },
  methods: {
    showDetails: function(){
      this.navigation.navigate('FilterParametersScreen',{ option: 'charts', onGoBack: () => this.refresh(),});
    },
    refresh: async function(){
      this.isLoading = true;
      // New chart data
      let generalPromise = new Promise(function(resolve,reject){
        resolve(utils.getChartData(store.state.filter.charts));
      });

      let array = await generalPromise;
      // Data for the chart
      this.chartData = array[0];

      // Header of quartiles table
      this.tableHead = ["Quartiles", store.state.filter.charts.pinnedMeasure, "ARPA" ];

      // Data of quartiles table
      // Arduino
      array[1].forEach((item, i) => {
        this.tableData[i][1] = item.toString();
      });
      // ARPA
      array[2].forEach((item, i) => {
        this.tableData[i][2] = item.toString();
      });

      this.isLoading = false;
    }
  }
};

</script>

<style>
.container {
  margin: 10;
}
.textContainer {
  flex-direction: row;
  justify-content: center;
}
.paddingElement {
  height: 20;
}
.buttonContainer{
  align-self: center;
  flex-direction: row;
  margin-vertical: 20;
  background-color: transparent;
}
.bubbleBotton{
  flex-direction: row;
  background-color: rgba(0,122,255,1);
  padding-horizontal: 15;
  padding-vertical: 15;
  border-radius: 20;
  width: 160;
  align-items: center;
  justify-content: center;
}
.buttonText{
  text-align: center;
  font-size: 20;
  color: white;
}
</style>
