<template>
    <scroll-view :content-container-style="{contentContainer: {
        paddingVertical: 20,
    }}">
      <view class="container">
        <!-- <text> {{ graphStyle }} </text> -->
        <line-chart :data="data" :width="width" :height="height"
        :chartConfig="chartConfig" bezier :style="graphStyle"/>
      </view>
    <button title="Filter Data" :on-press="showDetails" />
    </scroll-view>
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

import {getChartConfigs, data} from '../utils/ChartsConstants';

export default {
    props: {
      navigation: { type: Object }
    },
    components: {
      LineChart
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
        }
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
  margin-top: 50;
  align-items: center;
  justify-content: center;
  flex: 1;
}
</style>
