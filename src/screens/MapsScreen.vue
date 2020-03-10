<template>
  <map-view class="maps" :initial-region="coordinates" >
      <Circle :center="circle.center" :radius="circle.radius"
        fillColor="rgba(255, 0, 0, .5)" strokeColor="rgba(0,0,0,.2)"
        zIndex="2" strokeWidth="2"/>
        <view class="buttonContainer">
          <touchable-opacity class="bubbleBotton" :on-press="showDetails">
            <text class="buttonText">Filter</text>
          </touchable-opacity>
        </view>
  </map-view>
</template>

<script>
import MapView, {Circle} from "react-native-maps";
import * as React from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

export default {
    props: {
      navigation: { type: Object }
    },
    components: {
      MapView, Circle, Icon
    },
    data: function() {
    return {
      coordinates: {
        latitude: 37.78825,
        longitude: -122.4324,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      },
      circle: {
        center: {
          latitude: 37.78825,
          longitude: -122.4324,
        },
        radius: 1000,

      },
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
  background-color: rgba(255,255,255,0.7);
  padding-horizontal: 18;
  padding-vertical: 12;
  border-radius: 20;
  width: 100;
  align-items: center;
  justify-content: center;
  margin-horizontal: 5;
}

.buttonText{
  text-align: center;
}

</style>
