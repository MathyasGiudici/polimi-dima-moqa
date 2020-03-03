<template>
    <scroll-view :content-container-style="{contentContainer: {paddingVertical: 20}}">
      <touchable-opacity class="listElement" v-for="option in options" :key="option.route" :on-press="() => {changeScreen(option.route)}" >
        <text class="textListElement">{{option.title}}</text>
        <icon name="chevron-right" size="35" color="lightgrey"/>
      </touchable-opacity>
      <touchable-opacity class="listElement" :on-press="resetParameters">
        <text class="textListElement">Reset Parameters</text>
      </touchable-opacity>
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
          title: 'Wi-fi Selection',
          route: 'WIFIParameters'
        },
        {
          title: 'Server Conncetion',
          route: 'ServerParameters'
        },
        {
          title: 'RTK Connection',
          route: 'RTKParameters'
        },
        {
          title: 'ARPA Parameters',
          route: 'ARPAParameters',
        }],
    };
  },
  methods:{
    changeScreen: function(route) {
      console.log(route);
      this.navigation.navigate("Details");
    },
    resetParameters: function(){
      store.commit("DELETE");
      store.commit("REPLACE", getDefaultState());
    }
  }
}

</script>

<style>
.listElement {
  flex: 1;
  flexDirection: row;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 50;
  borderStyle: solid;
  borderBottomWidth: .3;
  borderBottomColor: lightgrey;
  padding-left: 15;
  padding-right: 5;
}
.textListElement {
  font-size: 17;
}
</style>
