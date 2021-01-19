const initialState = { alerts: [] };

//Notification default duration in milliseconds
const defaultDuration = 4000;

export const alert = {
  namespaced: true,
  state: initialState,
  actions: {
    async add({ commit }, alert) {
      //let duration = alert.duration || defaultDuration;
      let duration = defaultDuration;
      alert.duration = defaultDuration;
      var timeOut = setTimeout(() => {
        commit('AlertDismissed', alert);
      }, duration);
      commit('AlertAdded', { raw: alert, timeOut: timeOut });
    },

    dismiss(context, alert) {
      context.commit('AlertDismissed', alert);
    },
    dismissAll(context) {
      context.commit('DismissAll');
    },
  },
  mutations: {
    DismissAll(state) {
      state.alerts.length = 0;
    },
    AlertAdded(state, alert) {
      state.alerts.push(alert);
    },
    AlertDismissed(state, rawAlert) {
      const alert = rawAlert.raw || rawAlert;
      var i = state.alerts.map((n) => n.raw).indexOf(alert);

      if (i == -1) return;
      clearTimeout(state.alerts[i].timeOut);

      state.alerts.splice(i, 1);
    },
  },
};
