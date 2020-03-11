<template>
  <scroll-view class="mainContainer" :content-container-style="{contentContainer: {paddingVertical: 20}}">
    <!-- Space -->
    <view class="paddingElement"></view>

    <!-- Station picker -->
    <touchable-opacity class="listElement" v-for="station in stations" :key="stations.indexOf(station)" :on-press="() => {pinHandler(stations.indexOf(station))}">
      <text class="textListTitleElement" style="font-weight: normal;" v-if="prop=='air'">{{station.properties.nome}}</text>
      <text class="textListTitleElement" style="font-weight: normal;" v-if="prop=='weather'">{{station.properties.NomeStazione}} ({{station.properties.Tipologia}})</text>
      <icon class="toggle" name="check" size="35" color="black" v-if="pinned.includes(stations.indexOf(station))"/>
    </touchable-opacity>

    <!-- Space -->
    <view class="paddingElement"></view>

  </scroll-view>
</template>

<script>
import store from '../../store';
// Utils for icon
import * as React from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default {
  props: {
    navigation: { type: Object },
  },
  components: { Icon },
  data: function(){
    return {
      //Parameters related to measures
      prop: this.navigation.state.params.option.prop,
      pinned: store.state.settings.arpa[this.navigation.state.params.option.prop].pinnedStations,
      stations: this.navigation.state.params.stations,
    };
  },
  methods: {
    pinHandler: function(station){
      if(this.pinned.includes(station) && this.pinned.length > 1)
        this.pinned.splice(this.pinned.indexOf(station),1);
      else
        this.pinned.push(station);

      this.saveFilter();
    },
    saveFilter: function(){
      store.commit('changeArpaPickedStations', { targetMeasure: this.navigation.state.params.option.prop,
        picked: this.pinned });
      store.commit('SAVE');
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
.textListTitleElement {
  padding-left: 10;
  font-size: 17;
  font-weight: 600;
}
.textListElement {
  padding-right: 5;
  font-size: 17;
}
.toggle {
  padding-right: 5;
}
.subComponent{
  background-color: white;
}
</style>
