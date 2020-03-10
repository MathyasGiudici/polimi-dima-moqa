<template>
  <scroll-view class="mainContainer" :content-container-style="{contentContainer: {paddingVertical: 20}}" :onScrollEndDrag="checkConnection">
    <!-- Loading -->
    <view class="loading" v-if="isLoading" >
        <activity-indicator size="large" color="#lightgrey" />
    </view>
    <!-- Initial padding -->
    <view class="paddingElement"></view>

    <!-- IP Address -->
    <view class="listElement">
      <text class="textListTitleElement">IP Address</text>
      <text-input class="textListElement" placeholder="localhost" v-model="host" :onChangeText="hostChange" />
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

    <view class="paddingElement"></view>

    <!-- Connection Status -->
    <view class="listElement">
      <text class="textListTitleElement">Connection Status</text>
      <view class="circle" :style="connectionStatusStyle"></view>
    </view>
  </scroll-view>
</template>

<script>
import {getHandler} from '../../utils/Network';

export default {
  data: function(){
    return {
      isLoading: false,
      host: 'http://192.168.1.173',
      port: '3000',
      changingConnection: false,
      connectionStatusStyle: {
        backgroundColor: 'darkorange'
      },

    };
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
        }
      });
    },
    changeConnection: function(){
      this.changingConnection=false;
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
  font-weight: 600;
}
.textListElement {
  padding-right: 5;
  font-size: 17;
  text-align: right;
}
.circle {
   margin-right: 5;
   height: 30;
   width: 30;
   border-radius: 15;
}
</style>
