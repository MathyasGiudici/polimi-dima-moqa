<template>
  <view class="container">
    <view class="container">
      <text class="heading">Home Apple</text>
      <text>This is the App Details screen</text>
    </view>
    <view class="container">
      <text class="bigBlue">Vuex Test: {{localCounter}} | {{storeCounter}}</text>
      <button title="Increment" @press="increment"></button>
      <button title="Decrement" @press="decrement"></button>
      <text>-------------</text>
      <button title="Save" @press="save"></button>
      <button title="Restore" @press="restore"></button>
      <button title="Delete" @press="deleteData"></button>
    </view>
  </view>
</template>

<script>

import store from '../store';

export default {
    data: function() {
      return {
        localCounter: 0,
        storeCounter: store.state.count,
      };
  },
  methods:{
    increment: function(){
      this.localCounter++;
      store.commit('increment')
    },
    decrement: function(){
      this.localCounter--;
      store.commit('decrement')
    },
    save: function(){
      store.commit("SAVE");
    },
    restore: function(){
      store.commit("RESTORE");
    },
    deleteData: function(){
      store.commit("DELETE")
    }
  },
  mounted: function(){
    this.storeCounter = store.state.count;
  },
  updated: function(){
    this.storeCounter = store.state.count;
  }
};

</script>

<style>
.container {
  align-items: center;
  justify-content: center;
  flex: 1;
}
.heading {
  font-size: 30px;
  font-weight: bold;
  color: #ff0000;
  margin: 20px;
}
.bigBlue {
    color: blue;
    fontWeight: bold;
    fontSize: 30;
}
</style>
