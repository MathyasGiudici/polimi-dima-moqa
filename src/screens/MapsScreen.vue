<template>
  <view  class="container">
    <view style="flex:.92;">
      <map-view class="container"
          :initial-region="coordinates">
          <Circle
            :center="circle.center"
            :radius="circle.radius"
            fillColor="rgba(255, 0, 0, .5)"
            strokeColor="rgba(0,0,0,.2)"
            zIndex="2"
            strokeWidth="2"/>
          </map-view>
    </view>
    <view class="widgetArea" style="flex:.08;">
      <button title="Settings" :on-press="showDetails" />
    </view>
  </view>
</template>

<script>
import MapView, {Circle} from "react-native-maps";
export default {
    props: {
      navigation: { type: Object }
    },
    components: {
      MapView, Circle
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
      this.navigation.navigate('MapsParametersScreen')
    }
  }
};
</script>
<style>
.container {
  flex: 1;
}
.widgetArea{
  align-content: center;
  justify-content: center;
}
</style>
