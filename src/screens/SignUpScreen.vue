<template>
  <view class="container">
    <!-- Status bar -->
    <status-bar bar-style="dark-content" />
    <!-- Scroll Container -->
    <scroll-view class="scroll-container" :content-container-style="{contentContainer: {paddingVertical: 20}}">
      <!-- Space -->
      <view class="paddingElementBig"></view>
      <view class="paddingElementBig"></view>

      <!-- Title -->
      <text class="heading">User Sign Up</text>
      <view class="paddingElementSmall"></view>
      
      <!-- Email -->
      <text-input class="inputElement" placeholder="email" v-model="user.email"
        :onChangeText="text => changeParameter('email',text)" />
      <!-- Space -->
      <view class="paddingElementBig"></view>
      <!-- Name -->
      <text-input class="inputElement" placeholder="Name" v-model="user.firstName"
        :onChangeText="text => changeParameter('firstName',text)" />
      <!-- Space -->
      <view class="paddingElementBig"></view>
      <!-- Surname -->
      <text-input class="inputElement" placeholder="Surname" v-model="user.lastName"
        :onChangeText="text => changeParameter('lastName',text)" />
      <!-- Space -->
      <view class="paddingElementBig"></view>
      <!-- Male or female -->
      <view class="row">
        <touchable-opacity class="row-element" :on-press="()=>{isMale=true; changeParameter('gender','male');}">
          <icon name="check" color="black" size="20" style="padding-right:3;" v-if="isMale"/>
          <text class="row-element-text">Male</text>
        </touchable-opacity>
        <touchable-opacity class="row-element" :on-press="()=>{isMale=false; changeParameter('gender','female');}">
          <icon name="check" color="black" size="20" style="padding-right:3;" v-if="!isMale"/>
          <text class="row-element-text">Female</text>
        </touchable-opacity>
      </view>
      <!-- Space -->
      <view class="paddingElementBig"></view>
      <!-- Date Picker -->
      <touchable-opacity class="dateElementContainer" :on-press="()=>{isDateVisible=!isDateVisible;}">
        <text class="inputElement">{{showDate()}}</text>
      </touchable-opacity>
      <view v-if="isDateVisible">
        <DateTimePicker :value="birthDay_obj.date" mode="date" display="default" :onChange="setDate" />
      </view>
      <!-- Space -->
      <view class="paddingElementBig"></view>

      <!-- Password -->
      <text-input class="inputElement" placeholder="Password" v-model="user.password"
        :onChangeText="text => changeParameter('password',text)" secureTextEntry="true" />
      <!-- Space -->
      <view class="paddingElementBig"></view>
      <text-input class="inputElement" placeholder="Confirm Password" v-model="user.confirm_password"
        :onChangeText="text => changeParameter('confirm_password',text)" secureTextEntry="true" />
      <!-- Space -->
      <view class="paddingElementBig"></view>

      <!-- Sing Up Button -->
      <touchable-opacity class="bubbleBotton" :on-press="signUp" v-if="!isLoading">
        <icon name="account-plus" color="white" size="25" style="padding-right:3;"/>
        <text class="buttonText" style="padding-left:3;">Sign Up</text>
      </touchable-opacity>
      <view class="bubbleBotton" v-if="isLoading">
        <activity-indicator size="small" color="white" />
      </view>

      <!-- Space -->
      <view class="paddingElementSmall"></view>
      <!-- Back Login Button -->
      <button title="Already registered? Login" :on-press="login" />

      <!-- Space -->
      <view class="paddingElementBig"></view>
      <view class="paddingElementBig"></view>
    </scroll-view>
  </view>
</template>

<script>
import * as React from 'react';
import {Picker} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import store from '../store';
import {register} from '../utils/Network4Server';

// Utils for the date picker
import DateTimePicker from '@react-native-community/datetimepicker'
import {dateObjectCreator} from '../utils/Utils';
var today = new Date();
var yesterday = new Date();
yesterday.setDate(yesterday.getDate()-1);

export default {
  components: {
    Icon, DateTimePicker, Picker
  },
  props: {
    navigation: { type: Object }
  },
  data: function() {
    return {
      user: {
        email: '',
        password: '',
        confirm_password: '',
        firstName: '',
        lastName: '',
        gender: 'male',
        birthDay: ''
      },
      birthDay_obj: dateObjectCreator(yesterday),
      isMale: true,
      isDateVisible: false,
      isLoading : false,
    };
  },
  methods: {
    changeParameter: function(key,value){
      this.user[key] = value;
    },
    showDate: function(){
      var array = this.birthDay_obj.string.split(" ");
      return array[0] + " " + array[1] + " " + array[2];
    },
    setDate: function(event,date){
      var result = this.checkDateConsistency(date);
      if(result){
          this.birthDay_obj = dateObjectCreator(date);
      } else{
        this.birthDay_obj = dateObjectCreator(this.birthDay_obj.date);
      }
    },
    checkDateConsistency: function(newDate){
      // Checking if the date will not be in the future
      if(newDate > today){
        alert('Birthday could not be in the future!');
        return false;
      }
      // If i'm here there is consistency
      return true;
    },
    checkInputs: function(){
      if(this.user.email == "" ){
        alert('email could not be empty');
        return 0;
      }

      if(this.user.password == "" || this.user.confirm_password == ""){
        alert('Password could not be empty');
        return 0;
      }

      if(this.user.password != this.user.confirm_password){
        alert('Passwords do not match');
        return 0;
      }

      return 1;
    },
    login: function(){
      this.navigation.navigate('LoginScreen');
    },
    signUp: function(){
      this.isLoading = true;
      if(!this.checkInputs()){
        this.isLoading = false;
        return;
      }

      var newUser = this.user;
      delete newUser.confirm_password;
      newUser.birthDay = this.birthDay_obj.date.getFullYear() + '-' +
        ("0" + (this.birthDay_obj.date.getMonth() + 1)).slice(-2) + '-' +
        ("0" + this.birthDay_obj.date.getDate()).slice(-2) ;

        // Running request
        return register(newUser).then((value) => {
            // Stop loading
            this.isLoading = false;
            // Exploit result
            if(value == 'End Race' || value == 'Connection problems'){
              alert('Connection problems');
              return;
            }

            // Exploit response
            if(value.response && value.response == 'You are already register'){
              alert(value.response);
              return;
            }

            // Exploit response
            if(value.email != newUser.email){
              alert('Some problems in the sign up with the server');
              return;
            }

            // Storing user information
            store.commit('changeUserData', newUser);
            // Persistence
            store.commit('SAVE');
            this.navigation.navigate('LoginScreen');
          });
    },
  }
};
</script>

<style>
.container {
  flex: 1;
  align-items: center;
  justify-content: center;
}
.scroll-container {
  width: 100%;
}
.paddingElementBig {
  height: 40;
}
.paddingElementSmall {
  height: 10;
}
.heading {
  font-size: 34;
  font-weight: bold;
  margin: 20;
  align-self: center;
}
.inputElement {
  align-self: center;
  borderBottomWidth: .3;
  borderBottomColor: lightgrey;
  width: 80%;
  max-width: 450px;
  font-size: 20;
  text-align: center;
}
.dateElementContainer{
  align-self: center;
  borderBottomWidth: .3;
  borderBottomColor: lightgrey;
  width: 80%;
  max-width: 450px;
}
.row{
  align-self: center;
  width: 80%;
  flex-direction: row;
  justify-content: space-between;
}
.row-element{
  flex-direction: row;
  width: 45%;
  align-items: center;
  justify-content: center;
}
.row-element-text{
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
  max-width: 350px;
  align-items: center;
  justify-content: center;
}
.buttonText{
  text-align: center;
  font-size: 20;
  color: white;
}
</style>
