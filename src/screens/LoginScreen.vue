<template>
  <view class="container">
    <!-- Logo image -->
    <image :source="require('../../assets/header.png')" :style="{width: '70%',height:'20%'}"
      resizeMode="contain" />
    <!-- Space -->
    <view class="paddingElementBig"></view>

    <!-- Email -->
    <text-input class="inputElement" placeholder="address@email.com" v-model="authReq.email"
      :onChangeText="text => changeParameter('email',text)" />
    <!-- Space -->
    <view class="paddingElementBig"></view>
    <!-- Password -->
    <text-input class="inputElement" placeholder="password" v-model="authReq.password"
      :onChangeText="text => changeParameter('password',text)" secureTextEntry="true" />
    <!-- Space -->
    <view class="paddingElementBig"></view>

    <view class="warning" v-if="showWarning">
      <text style="color:white;font-size:20;">{{warningText}}</text>
    </view>

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
      showWarning: false,
      warningText: '',
      isLoading: false,
    };
  },
  mounted: function(){
    this.isLoading = true;

    // Checking if there is a previous session
    if(store.state.user.token != ""){
      return getUser().then((value) => {
        this.isLoading = false;
        // Exploit result
        if(value != 'End Race' && value != 'Connection problems' &&
          !value.response && value.response != "Unauthorized") {
            // Go to application
            this.navigation.navigate('BottomTabs');
          }
        });
    }
    
    this.isLoading = false;
  },
  methods: {
    changeParameter: function(key,value){
      this.authReq[key] = value;
    },
    login: function(){
      this.showWarning = false;
      this.isLoading = true;

      // Running request
      return login(this.authReq).then((value) => {
          // Exploit result
          if(value == 'End Race' || value == 'Connection problems'){
            this.warningText = 'Connection problems';
            this.showWarning = true;
            return;
          }
          // Exploit response
          if(value.response && value.response == 'Password is wrong'){
            this.warningText = value.response;
            this.showWarning = true;
            return;
          }

          // Saving new user information
          var toSave = value.user;
          toSave.token = value.token;

          // Storing user information
          store.commit('changeUserData', toSave);
          // Persistence
          store.commit('SAVE');
          // Go to application
          this.isLoading = false;
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
  background-color: white;
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
.warning{
  align-self: center;
  background-color: rgba(255,149,0,.75);
  padding-horizontal: 15;
  padding-vertical: 15;
  border-radius: 15;
  width: 80%;
  margin-bottom: 40;
  align-items: center;
  justify-content: center;
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
