<template>
  <view class="container">
    <status-bar bar-style="dark-content" />
    <view class="container">
      <text class="heading">Home Apple</text>
      <text>This is the App Details screen</text>
    </view>
    <!-- <view class="container">
      <text class="bigBlue">Vuex Test: {{localCounter}} | {{storeCounter}}</text>
      <text >Vuex Test: {{blobTester}}</text>
      <button title="Increment" @press="increment"></button>
      <button title="Decrement" @press="decrement"></button>
      <button title="Save" @press="save"></button>
      <button title="Restore" @press="restore"></button>
      <button title="Delete" @press="deleteData"></button>
    </view> -->
  </view>
</template>


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
