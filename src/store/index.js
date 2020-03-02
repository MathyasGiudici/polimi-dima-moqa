import Vue from "vue-native-core";
import Vuex from 'vuex';
import * as mutations from './mutations';
import {getDefaultState} from './state';

// Vuex is auto installed on the web
Vue.use(Vuex);

// Initial state
const state = getDefaultState();

// Store creation
const store = new Vuex.Store({
  state,
  mutations,
});

export default store;
