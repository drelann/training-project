import EventService from '../services/event.service';

const initialState = {};

export const event = {
  namespaced: true,
  state: initialState,
  actions: {
    async getAllEvents({ commit }) {
      return await EventService.getAllEvents().then((response) => {
        commit('setAllEvents', response);
        return Promise.resolve(response);
      });
    },
    async getEvent({ commit }, id) {
      return await EventService.getEvent(id).then((response) => {
        commit('setEvent', response);
        return Promise.resolve(response);
      });
    },
    async saveEvent({ commit }, event) {
      return await EventService.saveEvent(event).then((response) => {
        return Promise.resolve(response);
      });
    },
    async deleteImage({ commit }, id) {
      return await EventService.deleteImage(id).then(
        (response) => {
          return Promise.resolve(response);
        },
        (error) => {
          return Promise.reject(error);
        },
      );
    },
    async uploadImage({ commit }, event) {
      return await EventService.uploadImage(event).then(
        (response) => {
          return Promise.resolve(response);
        },
        (error) => {
          return Promise.reject(error);
        },
      );
    },
    async updateEventInfo({ commit }, event) {
      return await EventService.updateEventInfo(event).then((response) => {
        commit('setEvent', response);
        return Promise.resolve(response);
      });
    },
    async clearState({ commit }) {
      commit('clearAllState');
    },
  },
  mutations: {
    setAllEvents(state, events) {
      state.events = events.events;
    },
    setEvent(state, event) {
      state.event = event;
    },
    clearAllState(state) {
      state.event = null;
      state.events = null;
      state = null;
    },
  },
};
