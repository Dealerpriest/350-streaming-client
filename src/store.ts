import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    authenticated: <boolean>false,
    password: <string>'lund360',
  },
  mutations: {
    setAuthenticated(state, authState) {
      state.authenticated = authState;
    },
  },
  actions: {},
});
