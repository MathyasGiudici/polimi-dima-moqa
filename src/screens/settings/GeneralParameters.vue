<template>
  <scroll-view class="mainContainer" :content-container-style="{contentContainer: {paddingVertical: 20}}" :onScrollEndDrag="checkConnection">
    <!-- Loading -->
    <view class="loading" v-if="isLoading" >
        <activity-indicator size="large" color="#lightgrey" />
    </view>
    <!-- Space -->
    <view class="paddingElement"></view>

    <!-- IP Address -->
    <view class="listElement">
      <text class="textListTitleElement">IP Address</text>
      <text-input class="textListElement" placeholder="htpp://localhost" v-model="host" :onChangeText="hostChange" />
    </view>

    <!-- Port -->
    <view class="listElement">
      <text class="textListTitleElement">Port</text>
      <text-input class="textListElement" placeholder="3000" v-model="port" :onChangeText="portChange" />
    </view>

    <!-- Confirm Button -->
    <view class="listElement" style="justifyContent: space-around" v-if="changingConnection">
      <button title="Make changes" :on-press="changeConnection" />
    </view>

    <!-- Space -->
    <view class="paddingElement"></view>

    <!-- Connection Status -->
    <view class="listElement">
      <text class="textListTitleElement">Connection Status</text>
      <view class="circle" :style="connectionStatusStyle"></view>
    </view>

    <view class="paddingElement"></view>

    <!-- Description -->
    <view class="subComponent" v-if="showMessage">
      <text class="textSubComponent">{{responseMessage}}</text>
    </view>

    <!-- Space -->
    <view class="paddingElement"></view>

  </scroll-view>
</template>

<script>
import store from '../../store';
import {getHandler} from '../../utils/Network';

export default {
  props: {
    navigation: { type: Object },
  },
  data: function(){
    return {
      isLoading: false,
      host: store.state.settings[this.navigation.state.params.option.prop].ip,
      port: store.state.settings[this.navigation.state.params.option.prop].port,
      changingConnection: false,
      connectionStatusStyle: {
        backgroundColor: 'darkorange'
      },
      showMessage: false,
      responseMessage: '',
    };
  },
  mounted: function(){
    this.checkConnection();
  },
  methods: {
    hostChange: function(text){
      this.changingConnection = true;
      this.host = text;
    },
    portChange: function(text){
      this.changingConnection = true;
      this.port = text;
    },
    checkConnection: function(){
      this.changingConnection = false;
      this.isLoading = true;

      getHandler(this.host, this.port, 'text').then((value) => {
        // Stop loading motion
        this.isLoading = false;

        // Exploit result
        switch (value) {
          case 'End Race':
            this.connectionStatusStyle = { backgroundColor: 'darkorange' };
            break;
          case 'Connection problems':
            this.connectionStatusStyle = { backgroundColor: 'red' };
            break;
          default:
            this.connectionStatusStyle = { backgroundColor: 'green' };
            this.showMessage = true;
            this.responseMessage = value;
        }
      });
    },
    changeConnection: function(){
      // Hiding confirmation button
      this.changingConnection=false;
      // Changing state
      store.commit('changeSettingParameter', {targetParameter: this.navigation.state.params.option.prop, host: this.host, port: this.port});
      // // If are the data from arduino
      // if(this.navigation.state.params.option.prop == 'server'){
      //   // Loading the data
      //   store.commit('blobMutation', {key: 'arduinoData', value: null });
      // }

      // Persistence station
      store.commit('SAVE');
      // Checking connection
      this.checkConnection();
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
.circle {
   margin-right: 5;
   height: 30;
   width: 30;
   border-radius: 15;
}
.subComponent{
  align-items: center;
  justify-content: space-between;
  width: 100%;
  background-color: white;
  borderStyle: solid;
  borderTopWidth: .3;
  borderTopColor: lightgrey;
  borderBottomWidth: .3;
  borderBottomColor: lightgrey;
  padding-top: 20;
  padding-bottom: 20;
  padding-left: 5;
  padding-right: 5;
}
.textSubComponent{
  padding-left: 5;
  padding-right: 5;
  font-size: 15;
  text-align: left;
}
</style>
