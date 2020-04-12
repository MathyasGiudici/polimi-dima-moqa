<template>
  <scroll-view class="mainContainer" :content-container-style="{contentContainer: {paddingVertical: 20}}" :onScrollEndDrag="refresh">
    <!-- Loading -->
    <view class="loading" v-if="isLoading" >
        <activity-indicator size="large" color="#lightgrey" />
    </view>
    <!-- Space -->
    <view class="paddingElement"></view>

    <!-- Email -->
    <view class="listElement">
      <text class="textListTitleElement">Email</text>
      <text-input class="textListElement" placeholder="email@email.it" v-model="user.email"
        :onChangeText="text => changeParameter('email',text)" />
    </view>
    <!-- First Name -->
    <view class="listElement">
      <text class="textListTitleElement">Name</text>
      <text-input class="textListElement" placeholder="Mario" v-model="user.firstName"
        :onChangeText="text => changeParameter('firstName',text)" />
    </view>
    <!-- Surname -->
    <view class="listElement">
      <text class="textListTitleElement">Surname</text>
      <text-input class="textListElement" placeholder="Rossi" v-model="user.lastName"
        :onChangeText="text => changeParameter('lastName',text)" />
    </view>
    <!-- Date Picker -->
    <touchable-opacity class="listElement" :on-press="()=>{isDateVisible=!isDateVisible;}">
      <text class="textListTitleElement">Birthday</text>
      <text class="textListElement">{{showDate()}}</text>
    </touchable-opacity>
    <view class="subComponent" v-if="isDateVisible">
      <DateTimePicker :value="birthDay_obj.date" mode="date" display="default" :onChange="setDate" />
    </view>

    <!-- Confirm Button -->
    <view class="listElement" style="justifyContent: space-around" v-if="changingParameters">
      <button title="Make changes" :on-press="sendNewParameters" />
    </view>

    <!-- Space -->
    <view class="paddingElement"></view>

    <!-- New Password -->
    <view class="listElement">
      <text class="textListTitleElement">New Password</text>
      <text-input class="textListElement" placeholder="New Password" v-model="new_password"
        :onChangeText="text => changeParameter('new_password',text)"
        secureTextEntry="true" />
    </view>
    <!-- Confirm New Password -->
    <view class="listElement">
      <text class="textListTitleElement">Confirm Password</text>
      <text-input class="textListElement" placeholder="Confirm Password" v-model="confirm_password"
        :onChangeText="text => changeParameter('confirm_password',text)"
        secureTextEntry="true" />
    </view>
    <!-- Confirm Button -->
    <view class="listElement" style="justifyContent: space-around" v-if="changingPassword">
      <button title="Save new password" :on-press="sendNewPassword" />
    </view>


    <!-- Space -->
    <view class="paddingElement"></view>
    <!-- Logout Button -->
    <view class="listElement" >
      <button title="Logout" :on-press="logout" />
    </view>
    <!-- Space -->
    <view class="paddingElement"></view>
    <!-- Delete Button -->
    <view class="listElement" >
      <button title="Delete Account" :on-press="deleteAccount" color="rgb(255,59,48)" />
    </view>

    <!-- Space -->
    <view class="paddingElement"></view>

  </scroll-view>
</template>

<script>
import store from '../../store';
import {logout, deleteAccount, getUser, putUser} from '../../utils/Network4Server';

// Utils for the date picker
import DateTimePicker from '@react-native-community/datetimepicker'
import {dateObjectCreator} from '../../utils/Utils';
var today = new Date();

export default {
  props: {
    navigation: { type: Object },
  },
  components: { DateTimePicker },
  data: function(){
    return {
      isLoading: false,
      user: {
        email: store.state.user.email,
        firstName: store.state.user.firstName,
        lastName: store.state.user.lastName,
        gender: store.state.user.gender,
        birthDay: store.state.user.birthDay
      },
      birthDay_obj: dateObjectCreator(new Date(store.state.user.birthDay)),
      isDateVisible: false,
      changingParameters: false,
      new_password : '',
      confirm_password: '',
      changingPassword: false,
    };
  },
  mounted: function(){
    this.refresh();
  },
  methods: {
    refresh: function(){
      // Starting loading motion
      this.isLoading = true;

      return getUser().then((value) => {
        // Stop loading motion
        this.isLoading = false;

        // Exploit result
        if(value != 'End Race' && value != 'Connection problems' &&
          !value.response && value.response != "Unauthorized"){
            var keys = Object.keys(this.user);

            // Updating values
            keys.forEach((item, i) => {
              this.user[item] = value[item];
            });
            // Adjusting date type
            this.birthDay_obj = dateObjectCreator(new Date(this.user.birthDay));

            this.navigation.state.params.option.title = this.user.firstName +
              " " + this.user.lastName;
          }
        });
    },
    changeParameter: function(parameter,text){
      if(parameter == "new_password" || parameter == "confirm_password" ){
        this.changingPassword = true;
      } else{
        this.changingParameters = true;
      }
      this.user[parameter] = text;
    },
    showDate: function(){
      let array = this.birthDay_obj.string.split(" ");
      return array[0] + " " + array[1] + " " + array[2];
    },
    setDate: function(event,date){
      let result = this.checkDateConsistency(date);
      if(result){
          this.birthDay_obj = dateObjectCreator(date);
          this.changingParameters = true;
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
    logout: function(){
      // Starting loading motion
      this.isLoading = true;

      // Running request
      return logout(this.authReq).then((value) => {
        // Stop loading motion
        this.isLoading = false;

        // Exploit result
        if(value == 'End Race' || value == 'Connection problems'){
          alert('Connection problems');
          return;
        }
        // Exploit response
        if(value.response && value.response != 'Successful logout'){
          alert(value.response);
          return;
        }

        // Storing user information
        store.commit('changeUserData', { token: '' });
        // Persistence
        store.commit('SAVE');
        // Go to login page
        this.navigation.navigate('LoginScreen');
      });
    },
    deleteAccount: function(){
      // Start loading motion
      this.isLoading = true;

      // Running request
      return deleteAccount().then((value) => {
          // Stop loading motion
          this.isLoading = false;

          // Exploit result
          if(value == 'End Race' || value == 'Connection problems'){
            alert('Connection problems');
            return;
          }
          // Exploit response
          if(this.user.email != value.response){
            alert(value.response);
            return;
          }
          // Storing user information
          store.commit('clearUserData');
          // Persistence
          store.commit('SAVE');
          this.navigation.navigate('LoginScreen');
        });
    },
    sendNewParameters: function(){
      // Hide button
      this.changingParameters = false;

      // Checking consistency of the email
      if(this.user.email == "" ){
        alert('email could not be empty');
        return;
      }

      // Saving new parameters
      this.saveParameters('');
    },
    sendNewPassword: function(){
      console.log(this.new_password,this.confirm_password)
      // Hide button
      this.changingPassword = false;

      // Checking consistency of the password
      if(this.new_password == "" || this.confirm_password == ""){
        alert('Password could not be empty');
        return;
      }
      if(this.new_password != this.confirm_password){
        alert('Passwords do not match');
        return;
      }

      // Saving new parameters
      this.saveParameters(this.new_password);
    },
    saveParameters: function(password){
      var newUser = this.user;
      newUser.password = password;
      newUser.birthDay = this.birthDay_obj.date.getFullYear() + '-' +
        ("0" + (this.birthDay_obj.date.getMonth() + 1)).slice(-2) + '-' +
        ("0" + this.birthDay_obj.date.getDate()).slice(-2) ;

        // Running request
        return putUser(newUser).then((value) => {
            // Stop loading
            this.isLoading = false;
            // Exploit result
            if(value == 'End Race' || value == 'Connection problems'){
              alert('Connection problems');
              return;
            }
            // Exploit response
            if(value.email != newUser.email){
              alert('Some problems in the sing up with the server');
              return;
            }

            if(password == '')
              delete newUser.password;

            // Storing user information
            store.commit('changeUserData', newUser);
            // Persistence
            store.commit('SAVE');
          });
    }
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
.loading{
  flex: 1;
  justify-content: center;
  padding-top: 20;
}
.textListTitleElement {
  padding-left: 10;
  font-size: 17;
}
.textListElement {
  padding-right: 5;
  font-size: 17;
  text-align: right;
  color: grey;
}
.subComponent{
  background-color: white;
  borderStyle: solid;
  borderTopWidth: .3;
  borderTopColor: lightgrey;
  borderBottomWidth: .3;
  borderBottomColor: lightgrey;
}
</style>
