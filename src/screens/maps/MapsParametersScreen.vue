<template>
  <view>    
    <date-time-picker testID="dateTimePicker"
        timeZoneOffsetInMinutes="0"
        :value="new Date(1598051730000)"
        mode="date"
        display="default" />
  </view>
</template>

<script>

import DateTimePicker from '@react-native-community/datetimepicker';

export default {
components: { DateTimePicker }
};
</script>

<style>
</style>
