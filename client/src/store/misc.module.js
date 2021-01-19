import MiscService from '../services/misc.service';

const initialState = {};

export const misc = {
  namespaced: true,
  state: initialState,
  actions: {
    async getAllRecords({ commit }) {
      return await MiscService.getAll().then((response) => {
        commit('setAllCountries', response);
        return Promise.resolve(response.data);
      });
    },
  },
  mutations: {
    setAllCountries(state, countries) {
      state.countries = countries.data.countries;
    },
  },
};
