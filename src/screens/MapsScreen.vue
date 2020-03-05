<template>
  <map-view class="maps" :initial-region="coordinates" >
      <Circle :center="circle.center" :radius="circle.radius"
        fillColor="rgba(255, 0, 0, .5)" strokeColor="rgba(0,0,0,.2)"
        zIndex="2" strokeWidth="2"/>
        <touchable-opacity class="buttonArea" :on-press="showDetails">
          <text class="buttonText">Filter</text>
        </touchable-opacity>
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

.buttonArea{
  position: absolute;
  bottom: 20;
  width: 50%;
  height: 60;
  border-radius: 20;
  background-color: rgba(100,100,100,.5);
}

.buttonText{
  position: absolute;
  width: 100%;
  bottom: 20;
  color: white;
  font-size: 20;
  font-weight: bold;
  text-align: center;
}

</style>
