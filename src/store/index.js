import Vue from 'vue';
import Vuex from 'vuex';
import * as types from './actionType';
import util from '../utils/util';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    geoData: { a: 1 },
  },
  mutations: {
    [types.SET_GEODATA](state, payload) {
      state.geoData = payload;
    },
  },
  actions: {
    async [types.SET_GEODATA]({ commit }, args) {
      const data = await util.get(args);
      // console.log('in actions', data);
      commit(types.SET_GEODATA, data);
    },
  },
});
