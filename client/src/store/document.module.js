import DocumentService from '../services/document.service';

const initialState = {};

export const document = {
  namespaced: true,
  state: initialState,
  actions: {
    async getAllDocuments({ commit }, id) {
      return await DocumentService.getAllDocuments(id).then((response) => {
        commit('setAllDocuments', response);
        return Promise.resolve(response);
      });
    },
    async saveDocument({ commit }, document) {
      return await DocumentService.saveDocument(document).then((response) => {
        return Promise.resolve(response);
      });
    },
    async newDocument({ commit }, document) {
      return await DocumentService.newDocument(document).then((response) => {
        return Promise.resolve(response);
      });
    },
    async deleteDocument({ commit }, id) {
      return await DocumentService.deleteDocument(id).then((response) => {
        return Promise.resolve(response);
      });
    },
    async clearState({ commit }) {
      commit('clearAllState');
    },
  },
  mutations: {
    setAllDocuments(state, documents) {
      state = documents;
    },
    clearAllState(state) {
      state.documents = null;
      state.event = null;
    },
  },
};
