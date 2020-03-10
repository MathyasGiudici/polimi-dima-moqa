<template>
    <scroll-view class="mainContainer" :content-container-style="{contentContainer: {paddingVertical: 20}}">
      <view class="paddingElement"></view>

      <touchable-opacity class="listElement" v-for="option in options" :key="option.route" :on-press="() => {changeScreen(option.route)}" >
        <text class="textListElement">{{option.title}}</text>
        <icon name="chevron-right" size="35" color="lightgrey"/>
      </touchable-opacity>

      <view class="paddingElement"></view>

      <view class="listElement" >
        <button title="Reset Parameters" :on-press="resetParameters" />
      </view>
    </scroll-view>
</template>

</template>

<script>
// Utils for icon
import * as React from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

import store from '../store';
import {getDefaultState} from '../store/state';

export default{
  props: {
    navigation: { type: Object }
  },
  components: {
    Icon
  },
  data: function(){
    return {
      options : [
        {
          title: 'Wi-Fi Selection',
          route: 'WIFIParameters'
        },
        {
          title: 'Server Conncetion',
          route: 'Details'
          // route: 'ServerParameters'
        },
        {
          title: 'RTK Connection',
          route: 'Details'
          // route: 'RTKParameters'
        },
        {
          title: 'ARPA Parameters',
          route: 'Details'
          // route: 'ARPAParameters',
        }],
    };
  },
  methods:{
    changeScreen: function(route) {
      this.navigation.navigate(route);
    },
    resetParameters: function(){
      store.commit("DELETE");
      store.commit("REPLACE", getDefaultState());
    }
  }
}

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

.textListElement {
  padding-left: 10;
  font-size: 17;
}
</style>
