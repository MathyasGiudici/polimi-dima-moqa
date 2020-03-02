<template>
  <view class="container">
    <view class="container2">
      <text class="heading">Settings</text>
    <!-- </view>
    <view class="container2"> -->
    <text>This is the App Settings screen</text>
    </view>
    <view class="container2">
      <button title="Press me" @press="goToDetails"></button>
    </view>
  </view>
</template>

<script>

export default{
  props: {
    navigation: { type: Object }
  },
  methods:{
    goToDetails: function() {
      this.navigation.navigate("Details");
    }
  }
}

</script>

<style>
.container {
  align-items: center;
  justify-content: center;
  flex: 1;
}

.container2 {
  align-items: center;
  justify-content: center;
  padding: 5;
}


.heading {
  font-size: 30px;
  font-weight: bold;
  color: green;
  margin: 20px;
}
</style>
