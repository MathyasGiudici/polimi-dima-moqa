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
      <view class="row">
        <view class="textContainer">
          <icon name="circle" color="grey" size="20"/>
          <text style="font-size: 17;"> Arduino Data</text>
        </view>
        <view class="textContainer">
          <icon name="circle" color="red" size="20"/>
          <text style="font-size: 17;"> ARPA Data </text>
        </view>
      </view>

      <!-- Space -->
      <view class="paddingElement"></view>

      <!-- Table -->
      <text class="tableTitle">{{tableMeasure}}'s deviation</text>
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
const measures = ["Temperature", "Humidity", "Pressure", "Altitude", "TVOCs", "eCO2", "PM0.5", "PM1", "PM2.5", "PM4", "PM10"];
const units = ["°C", "%", "Pa", "m", "ppb", "ppm", "μm", "μm", "μm", "μm", "μm"];

// import of the store
import store from '../store';
import { EventRegister } from 'react-native-event-listeners';

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
        tableMeasure: store.state.filter.charts.pinnedMeasure,
        tableHead: ["Quartiles", "Arduino", "ARPA" ],
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
  mounted: function(){
    this.listener = EventRegister.addEventListener('blobArduinoDataUpdate',(data)=>{
      return this.refresh();
    });
  },
  beforeDestroy: function(){
    EventRegister.removeEventListener(this.listener);
  },
  methods: {
    showDetails: function(){
      this.navigation.navigate('FilterParametersScreen',{ option: 'charts', onGoBack: () => this.refresh(),});
    },
    refresh: async function(){
      this.isLoading = true;
      // New chart data
      var generalPromise = new Promise(function(resolve,reject){
        var data = utils.getChartData(store.state.filter.charts);
        resolve(data);
      });

      var array = await generalPromise;
      // Data for the chart
      this.chartData = array[0];

      // Header of quartiles table
      this.tableMeasure = store.state.filter.charts.pinnedMeasure;

      var targetMeasure = " " + units[measures.indexOf(store.state.filter.charts.pinnedMeasure)];

      // Data of quartiles table
      // Arduino
      array[1].forEach((item, i) => {
        this.tableData[i][1] = item.toString() + targetMeasure;
      });
      // ARPA
      array[2].forEach((item, i) => {
        this.tableData[i][2] = item.toString() + targetMeasure;
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
.row{
  flex-direction: row;
  justify-content: center;
}
.textContainer {
  flex-direction: row;
  justify-content: center;
  padding-left: 10;
  padding-right: 10;
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
.tableTitle{
  font-size: 24;
  font-weight: 500;
  margin-top: 10;
  align-self: center;

}
</style>
