<template>
  <map-view class="maps" :initial-region="initialCoordinates" >
    <!-- Arduino data -->
    <Circle v-for="circle in arduinoData" :center="circle.center" :radius="circle.radius"
      fillColor="rgba(0, 0, 255, .5)" strokeColor="rgba(0,0,0,.2)"
      zIndex="2" strokeWidth="2"/>

    <!-- Arpa data -->
    <Circle v-for="circle in arpaData" :center="circle.center" :radius="circle.radius"
      fillColor="rgba(255, 0, 0, .5)" strokeColor="rgba(0,0,0,.2)"
      zIndex="2" strokeWidth="2"/>

    <!-- Filter Button -->
    <view class="buttonContainer">
      <touchable-opacity class="bubbleBotton" :on-press="showDetails">
        <icon name="filter-outline" color="white" size="25"/>
        <text class="buttonText">Filter</text>
      </touchable-opacity>
    </view>
  </map-view>
</template>

<script>
import MapView, {Circle} from "react-native-maps";
import * as React from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import * as utils from '../utils/MapsUtils';

import store from '../store';

export default {
    props: {
      navigation: { type: Object }
    },
    components: {
      MapView, Circle, Icon
    },
    data: function() {
    return {
      arduinoData: [],
      arpaData: [],
      initialCoordinates: {
        latitude: 45.474098205566399,
        longitude: 9.2347803115844709,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      },
    };
  },
  beforeMount: async function(){
    this.refresh();
  },
  methods: {
    showDetails: function(){
      this.navigation.navigate('FilterParametersScreen',{ option: 'maps', onGoBack: () => this.refresh(),});
    },
    refresh: async function(){
      // New chart data
      let generalPromise = new Promise(async function(resolve,reject){
        let result = await utils.getMapData(store.state.filter.maps);
        resolve(result);
      });

      let returnedObject = await generalPromise;

      // Data for the map
      this.arduinoData = returnedObject.arduino;
      this.arpaData = returnedObject.arpa;
    }
  }
};
</script>
<style>
.container {
  flex: 1;
}

.maps{
  flex: 1;
  justify-content: flex-end;
  align-items: center;
}

.buttonContainer{
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
