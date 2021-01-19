import Vue from 'vue';
import Vuex from 'vuex';
import createPersistedState from 'vuex-persistedstate';
import { auth } from './auth.module';
import { client } from './client.module';
import { misc } from './misc.module';
import { admin } from './admin.module';
import { event } from './event.module';
import { document } from './document.module';
import { alert } from './alert.module';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    auth,
    client,
    misc,
    admin,
    event,
    document,
    alert,
  },
  plugins: [createPersistedState()],
});
