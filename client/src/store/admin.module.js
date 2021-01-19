import AdminService from '../services/admin.service';
import EventService from '../services/event.service';
const initialState = {};

export const admin = {
  namespaced: true,
  state: initialState,
  actions: {
    async getAllUsers({ commit }) {
      return await AdminService.getAllUsers().then((response) => {
        commit('setAllUsers', response);
        return Promise.resolve(response);
      });
    },
    async getAllFreeUsers({ commit }) {
      return await AdminService.getAllFreeUsers().then((response) => {
        commit('setAllFreeUsers', response);
        return Promise.resolve(response);
      });
    },
    async editEvent({ commit }, user) {
      return await AdminService.editEvent(user).then((response) => {
        commit('setAllUsers', response.data.data);
        return Promise.resolve(response);
      });
    },
    async editRole({ commit }, user) {
      return await AdminService.editRole(user).then((response) => {
        commit('setAllUsers', response.data.data);
        return Promise.resolve(response);
      });
    },
    async clearState({ commit }) {
      commit('clearAllState');
    },
  },
  mutations: {
    setAllUsers(state, users) {
      state.users = users;
    },
    setAllFreeUsers(state, users) {
      state.free_users = users;
    },
    clearAllState(state) {
      state.event = null;
      state.events = null;
      state.users = null;
      state.free_users = null;
    },
  },
};
