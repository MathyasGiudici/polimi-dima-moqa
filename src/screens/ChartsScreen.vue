<template>
    <scroll-view :content-container-style="{contentContainer: {paddingVertical: 20}}">

      <!-- Space -->
      <view class="paddingElement"></view>

      <!-- Graph -->
      <view class="container">
        <line-chart :data="data" :width="width" :height="height"
        :chartConfig="chartConfig" bezier :style="graphStyle"/>
      </view>

      <view class="container">
        <text>Keys of the graph</text>
      </view

      <!-- Table -->
      <view class="container">
        <Table :borderStyle="{borderWidth: 2, borderColor: '#c8e1ff'}" >
          <Row :data="tableHead" :style="styleHead" :textStyle="styleText"/>
          <Rows :data="tableData" :textStyle="styleText"/>
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
      </view
    </scroll-view>
</template>

<script>
// Datat visualization utils
import { LineChart, BarChart, PieChart, ProgressChart, ContributonGraph } from 'react-native-chart-kit';
import { Table, Row, Rows } from 'react-native-table-component';
import {Dimensions} from 'react-native';

// Utils for icon
import * as React from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// Charts constants
import {getChartConfigs, data} from '../utils/ChartsConstants';

export default {
    props: {
      navigation: { type: Object }
    },
    components: {
      LineChart, Table, Row, Rows, Icon
    },
    data: function() {
      return {
        data: data,
        width : Dimensions.get('window').width - 25,
        height : 250,
        chartConfig: getChartConfigs()[0],
        graphStyle: {
          marginVertical: 8,
          ...getChartConfigs()[0].style
        },
        tableHead: ['Head', 'Head2', 'Head3', 'Head4'],
        tableData: [
          ['1', '2', '3', '4'],
          ['a', 'b', 'c', 'd'],
          ['1', '2', '3', '456\n789'],
          ['a', 'b', 'c', 'd']
        ],
        styleHead: { height: 40, backgroundColor: '#f1f8ff' },
        styleText: { margin: 6 }
      };
  },

  methods: {
    showDetails: function(){
      this.navigation.navigate('FilterParametersScreen',{ option: 'charts',});
    }
  }
};

</script>

<style>
.container {
  margin: 10;
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
