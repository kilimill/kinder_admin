import Vue from 'vue';
import Vuex from 'vuex';
import createPersistedState from "vuex-persistedstate";

import mutations from './mutations';
import actions from './actions';
import getters from './getters';

Vue.use(Vuex);

export default new Vuex.Store({
	state: {
		mobile: (typeof window.orientation !== "undefined") || (navigator.userAgent.indexOf('IEMobile') !== -1),
		token: null,
		elems: [],
		blocks: []
	},
	mutations,
	actions,
	getters,
	plugins: [createPersistedState({
		paths: ['token', 'elems'],
	})],
});
