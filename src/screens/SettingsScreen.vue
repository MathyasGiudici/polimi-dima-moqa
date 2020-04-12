<template>
    <scroll-view class="mainContainer" :content-container-style="{contentContainer: {paddingVertical: 20}}" :onScrollEndDrag="refresh">
      <view class="paddingElement"></view>

      <!-- User setting -->
      <touchable-opacity class="userElement" :on-press="userSetting" >
        <icon name="account" size="80" color="lightgrey"/>
        <view>
          <text class="accountElement">{{user.name}} {{user.surname}}</text>
          <text class="textListElement">{{user.email}}</text>
        </view>
      </touchable-opacity>
      <!-- Space -->
      <view class="paddingElement"></view>

      <!-- List of possible Settings -->
      <touchable-opacity class="listElement" v-for="option in options" :key="option.prop" :on-press="() => {changeScreen(option)}" >
        <text class="textListElement">{{option.title}}</text>
        <icon name="chevron-right" size="35" color="lightgrey"/>
      </touchable-opacity>

      <!-- Space -->
      <view class="paddingElement"></view>

      <!-- Reset Button -->
      <view class="listElement" >
        <button title="Reset Parameters" :on-press="resetParameters" />
      </view>
    </scroll-view>
</template>

</template>

<script>
// Utils for icon
import * as React from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import store from '../store';
import {getDefaultState} from '../store/state';

export default{
  props: {
    navigation: { type: Object },
  },
  components: {
    Icon
  },
  data: function(){
    return {
      options : [
        {
          title: 'Wi-Fi Connection',
          route: 'GeneralParameters',
          prop:  'wifi'
        },
        {
          title: 'Server Connection',
          route: 'GeneralParameters',
          prop:  'server'
        },
        {
          title: 'RTK Connection',
          route: 'GeneralParameters',
          prop:  'rtk'
        },
        {
          title: 'ARPA Weather Data Connection',
          route: 'ARPAParameters',
          prop:  'weather'
        },
        {
          title: 'ARPA Air Quality Data Connection',
          route: 'ARPAParameters',
          prop:  'air'
        }],
        user: {
          name: store.state.user.firstName,
          surname: store.state.user.lastName,
          email: store.state.user.email
        }
    };
  },
  methods:{
    refresh: function(){
      this.user.name = store.state.user.firstName;
      this.user.surname = store.state.user.lastName;
      this.user.email = store.state.user.email;
    },
    userSetting: function(){
      const option = {
        title: this.user.name + " " + this.user.surname,
        route: 'UserParameters',
        prop:  'user'
      };
      this.navigation.navigate(option.route,{ option: option });
    },
    changeScreen: function(option) {
      this.navigation.navigate(option.route,{ option: option });
    },
    resetParameters: function(){
      store.commit("DELETE");
      store.commit("REPLACE", getDefaultState());
      this.navigation.navigate('LoginScreen');
      alert("Initial state restored");
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

.userElement {
  flex: 1;
  flexDirection: row;
  align-items: center;
  justify-content:flex-start;
  width: 100%;
  height: 100;
  background-color: white;
  borderStyle: solid;
  borderTopWidth: .3;
  borderTopColor: lightgrey;
  borderBottomWidth: .3;
  borderBottomColor: lightgrey;
  padding-left: 20;
}

.paddingElement {
  height: 40;
}
.textListElement {
  padding-left: 10;
  font-size: 17;
}
.accountElement {
  padding-left: 10;
  padding-bottom: 5;
  font-size: 24;
  font-weight: 500;
}
</style>
