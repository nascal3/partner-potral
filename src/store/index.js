import Vue from 'vue';
import Vuex from 'vuex';
import Apix from './Apix';

Vue.use(Vuex);

let apix = new Apix();

const store = new Vuex.Store({
  state: {
    ...apix.getState(),
  },

  getters: {
    ...apix.getGetters(),
  },

  mutations: {
    ...apix.getMutations(),
  },

  actions: {
    ...apix.getActions(),
  },
});

export default store
