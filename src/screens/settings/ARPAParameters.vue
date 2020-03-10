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
      <text class="textListTitleElement">Monitoring Station URL</text>
      <text-input class="textListElement" placeholder="htpp://localhost" v-model="host" :onChangeText="hostChange" />
    </view>

    <!-- Confirm Button -->
    <view class="listElement" style="justifyContent: space-around" v-if="changingConnection">
      <button title="Make changes" :on-press="changeConnection" />
    </view>

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

    <!-- Initial padding -->
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
      host: 'http://dati.comune.milano.it/dataset/d6960c75-0a02-4fda-a85f-3b1c4aa725d6/resource/635c6508-b335-48b1-b3c8-d43e78ad3380/download/qaria_stazione.geojson',
      changingConnection: false,
      connectionStatusStyle: {
        backgroundColor: 'darkorange'
      },
      showMessage: false,
      responseMessage: '',
    };
  },
  mounted: function(){
    //this.checkConnection();
  },
  methods: {
    hostChange: function(text){
      this.changingConnection = true;
      this.host = text;
    },
    checkConnection: function(){
      this.changingConnection = false;
      this.isLoading = true;

      getHandler(this.host,'', 'json').then((value) => {
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
