import { createStore } from 'vuex';
import VuexPersist from 'vuex-persist';

const vuexLocalStorage = new VuexPersist({
  key: 'vuex', // The key to store the state on in the storage provider.
  storage: window.localStorage, // or window.sessionStorage or localForage
  // Function that passes the state and returns the state with only the objects you want to store.
  // reducer: state => state,
  // Function that passes a mutation and lets you decide if it should update the state in localStorage.
  // filter: mutation => (true)
});

const store = createStore({
  plugins: [vuexLocalStorage.plugin],
  state() {
    return {
      currentUser: {},
      authToken: null,
      activityid:0
    };
  },
  mutations: {
    setCurrentUser(state, user) {
      state.currentUser = user;
    },
    setAuthToken(state, token) {
      state.authToken = token;
    },
  },
  getters: {
    currentUser: (state) => state.currentUser,
    authToken: (state) => state.authToken,
  },
  actions: {
    setUser(context, payload) {
      context.commit('setCurrentUser', payload);
    },
    setToken(context, payload) {
      context.commit('setAuthToken', payload);
    },
  },
});

export default store;
