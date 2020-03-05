<template>
    <view class="container">
    <!-- <scroll-view :content-container-style="{contentContainer: {
        paddingVertical: 20,
    }}"> -->
      <modal :isVisible="modalVisible">
        <parameters-screen></parameters-screen>
      </modal>

      <line-chart :data="data" :width="width" :height="height"
        :chartConfig="chartConfig" bezier :style="graphStyle"/>
      <button title="press me" :on-press="()=>{modalVisible=!modalVisible}" />
    <!-- </scroll-view> -->
    </view>
</template>

<script>
import {
  LineChart,
  BarChart,
  PieChart,
  ProgressChart,
  ContributionGraph
} from 'react-native-chart-kit';

import {Dimensions} from 'react-native';

import Modal from "react-native-modal";
import ParametersScreen from "./params/ParametersScreen.vue";

import {getChartConfigs, data} from '../utils/ChartsConstants';

export default {
    props: {
      navigation: { type: Object }
    },
    components: {
      LineChart, Modal, ParametersScreen
    },
    data: function() {
      return {
        data: data,
        width : Dimensions.get('window').width,
        height : 220,
        chartConfig: getChartConfigs()[0],
        graphStyle: {
          marginVertical: 8,
          ...getChartConfigs()[0].style
        },
        modalVisible: false,
      };
  },

  methods: {
    showDetails: function(){
      this.navigation.navigate('ParametersScreen')
    }
  }
};

</script>

<style>
.container {
  margin-top: 50;
  align-items: center;
  justify-content: center;
  flex: 1;
}
</style>
