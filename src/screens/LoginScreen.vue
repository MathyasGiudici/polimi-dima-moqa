<template>
  <view class="container">
    <!-- Status bar -->
    <status-bar bar-style="dark-content" />

    <!-- Logo image -->
    <image :source="require('../../assets/header.png')" :style="{width: '70%',height:'20%'}"
      resizeMode="contain" />
    <!-- Space -->
    <view class="paddingElementBig"></view>

    <!-- Email -->
    <text-input class="inputElement" placeholder="email" v-model="authReq.email"
      :onChangeText="text => changeParameter('email',text)" />
    <!-- Space -->
    <view class="paddingElementBig"></view>
    <!-- Password -->
    <text-input class="inputElement" placeholder="password" v-model="authReq.password"
      :onChangeText="text => changeParameter('password',text)" secureTextEntry="true" />
    <!-- Space -->
    <view class="paddingElementBig"></view>

    <!-- Login Button -->
    <touchable-opacity class="bubbleBotton" :on-press="login" v-if="!isLoading">
      <icon name="login" color="white" size="25" style="padding-right:3;"/>
      <text class="buttonText" style="padding-left:3;">Login</text>
    </touchable-opacity>
    <view class="bubbleBotton" v-if="isLoading">
      <activity-indicator size="small" color="white" />
    </view>

    <!-- Space -->
    <view class="paddingElementSmall"></view>
    <!-- Registration Button -->
    <button title="Sing Up" :on-press="singUp" />
  </view>
</template>

<script>
import * as React from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import store from '../store';
import {login, getUser} from '../utils/Network4Server';

export default {
  components: {
    Icon
  },
  props: {
    navigation: { type: Object }
  },
  data: function() {
    return {
      authReq: {
        email: store.state.user.email,
        password: store.state.user.password
      },
      isLoading: false,
    };
  },
  mounted: function(){
    // Start Loading
    this.isLoading = true;

    // Checking if there is a previous session
    if(store.state.user.token != ""){
      return getUser().then((value) => {
        // Stop loading
        this.isLoading = false;
        // Exploit result
        if(value != 'End Race' && value != 'Connection problems' &&
          !value.response && value.response != "Unauthorized") {
            // Go to application
            this.navigation.navigate('BottomTabs');
          }
        });
    }
    // Stop loading
    this.isLoading = false;
  },
  methods: {
    changeParameter: function(key,value){
      this.authReq[key] = value;
    },
    login: function(){
      // Start Loading
      this.isLoading = true;

      // Running request
      return login(this.authReq).then((value) => {
          // Stop loading
          this.isLoading = false;
          // Exploit result
          if(value == 'End Race' || value == 'Connection problems'){
            alert('Connection problems');
            return;
          }
          // Exploit response
          if(value.response && value.response != 'Successful login'){
            alert(value.response);
            return;
          }

          // Saving new user information
          var toSave = value.user;
          toSave.password = this.authReq.password;
          toSave.token = value.token;

          // Storing user information
          store.commit('changeUserData', toSave);
          // Persistence
          store.commit('SAVE');
          this.navigation.navigate('BottomTabs');
        });
    },
    singUp: function(){
      this.navigation.navigate('SingUpScreen');
    }
  }
};
</script>

<style>
.container {
  flex: 1;
  align-items: center;
  justify-content: center;
}
.paddingElementBig {
  height: 40;
}
.paddingElementSmall {
  height: 10;
}
.inputElement {
  borderBottomWidth: .3;
  borderBottomColor: lightgrey;
  width: 80%;
  font-size: 20;
  text-align: center;
}
.bubbleBotton{
  align-self: center;
  flex-direction: row;
  background-color: rgba(0,122,255,1);
  padding-horizontal: 15;
  padding-vertical: 15;
  border-radius: 15;
  height: 60;
  width: 50%;
  align-items: center;
  justify-content: center;
}
.buttonText{
  text-align: center;
  font-size: 20;
  color: white;
}
</style>
