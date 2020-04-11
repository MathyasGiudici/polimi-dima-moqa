<template>
  <view class="container">
    <button title="login" :on-press="login" />
  </view>
</template>

<script>
export default {
  props: {
    navigation: { type: Object }
  },
  data: function() {
    return {
      email: '',
      password: '',
    };
  },
  methods: {
    login: function(){
      console.log("login");
      this.navigation.navigate('BottomTabs');
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
.text-color-primary {
  color: blue;
  font-size: 30;
}
</style>
