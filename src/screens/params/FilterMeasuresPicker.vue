<template>
  <scroll-view class="mainContainer" :content-container-style="{contentContainer: {paddingVertical: 20}}">
    <!-- Space -->
    <view class="paddingElement"></view>

    <!-- Station picker -->
    <touchable-opacity class="listElement" v-for="mea in measures" :key="measures.indexOf(mea)" :on-press="() => {pinHandler(measures.indexOf(mea))}">
      <view class="textListContainer">
        <text class="textListTitleElement" >{{mea}}</text>
      </view>
      <icon class="toggle" name="check" size="35" color="black" v-if="pinned == measures.indexOf(mea)"/>
    </touchable-opacity>

    <!-- Space -->
    <view class="paddingElement"></view>

  </scroll-view>
</template>

<script>
// Utils for icon
import * as React from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default {
  props: {
    navigation: { type: Object },
  },
  components: { Icon },
  data: function(){
    return {
      //Parameters related to measures
      pinned: 0,
      measures: ["Temperature", "Humidity", "Pressure", "Altitude", "TVOCs", "eCO2", "PM0.5", "PM1", "PM2.5", "PM4", "PM10"],
    };
  },
  mounted: function(){
    this.loader();
  },
  methods: {
    loader: function(){
      this.pinned = this.measures.indexOf(this.navigation.state.params.pinnedMeasure);
    },
    pinHandler: function(index){
      // Local pinner
      this.pinned = index;

      // Finding the index in the array
      this.navigation.state.params.onGoBack(this.measures[index]);
    },
  }
};
</script>

<style>
.mainContainer {
  background-color: rgb(242,242,247);
}
.listElement {
  flex: 1;
  flexDirection: row;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 50;
  background-color: white;
  borderStyle: solid;
  borderTopWidth: .3;
  borderTopColor: lightgrey;
  borderBottomWidth: .3;
  borderBottomColor: lightgrey;
  padding-left: 5;
  padding-right: 5;
}
.paddingElement {
  height: 40;
}
.textListContainer{
  flex-direction: column;
}
.textListTitleElement {
  padding-left: 10;
  font-size: 17;
}
.toggle {
  padding-right: 5;
  color: rgba(0,122,255,1);
}
.subComponent{
  background-color: white;
}
</style>
