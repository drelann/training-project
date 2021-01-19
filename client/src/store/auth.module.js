import AuthService from '../services/auth.service';
import { admin } from './admin.module';
import { document } from './document.module';
import { event } from './event.module';
const user = JSON.parse(localStorage.getItem('user'));

const initialState = user
  ? { status: { loggedIn: true }, user, userData }
  : { status: { loggedIn: false }, user, userData: null };

export const auth = {
  namespaced: true,
  state: initialState,
  actions: {
    register({ commit }, user) {
      return AuthService.register(user).then(
        (response) => {
          commit('registerSuccess');
          return Promise.resolve(response);
        },
        (error) => {
          commit('registerFailure');
          return Promise.reject(error);
        },
      );
    },
    login({ commit }, user) {
      return AuthService.login(user).then(
        (user) => {
          commit('loginSuccess', user);
          return Promise.resolve(user);
        },
        (error) => {
          commit('loginFailure');
          return Promise.reject(error);
        },
      );
    },
    logout({ commit }) {
      AuthService.logout();
      this.dispatch('event/clearState', null, { root: true });
      this.dispatch('document/clearState', null, { root: true });
      this.dispatch('admin/clearState', null, { root: true });
      commit('logout');
    },
    async getUserData({ commit }) {
      return await AuthService.getUserData().then((response) => {
        commit('setUserData', response);
        return Promise.resolve(response);
      });
    },
    async deleteImage() {
      return await AuthService.deleteImage().then(
        (response) => {
          return Promise.resolve(response);
        },
        (error) => {
          return Promise.reject(error);
        },
      );
    },
    async uploadImage({ commit }, image) {
      return await AuthService.uploadImage(image).then(
        (response) => {
          return Promise.resolve(response);
        },
        (error) => {
          return Promise.reject(error);
        },
      );
    },
    async updateUserInfo({ commit }, user) {
      return await AuthService.updateUserInfo(user).then(
        (response) => {
          return Promise.resolve(response);
        },
        (error) => {
          return Promise.reject(error);
        },
      );
    },
    async deletePin() {
      return await AuthService.deletePin().then(
        (response) => {
          return Promise.resolve(response);
        },
        (error) => {
          return Promise.reject(error);
        },
      );
    },
  },
  mutations: {
    registerSuccess(state) {
      state.status.loggedIn = false;
    },
    registerFailure(state) {
      state.status.loggedIn = false;
    },
    loginSuccess(state, user) {
      state.status.loggedIn = true;
      state.user = user;
    },
    loginFailure(state) {
      state.status.loggedIn = false;
      state.user = state.userData = null;
    },
    logout(state) {
      state.status.loggedIn = false;
      state.user = state.userData = null;
    },
    setUserData(state, userData) {
      state.userData = userData;
    },
  },
};
