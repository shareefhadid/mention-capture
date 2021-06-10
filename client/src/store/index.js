import { createStore } from "vuex";
import axios from "axios";
import router from "@/router";
import Cookies from "js-cookie";
import sourceList from "../assets/sources.json";

export default createStore({
  state: {
    loggedIn: Boolean(Cookies.get("loggedIn")) || false,
    showHeader: true,
    searches: [],
    newsletters: [],
    search: Cookies.get("search") ? JSON.parse(Cookies.get("search")) : {},
    newsletter: Cookies.get("newsletter")
      ? JSON.parse(Cookies.get("newsletter"))
      : {},
    loading: false,
    results: [],
    sourceList: sourceList,
  },
  getters: {},
  mutations: {
    setLoggedIn(state) {
      state.loggedIn = true;
    },
    removeLoggedIn(state) {
      state.loggedIn = false;
    },
    setShowHeader(state) {
      state.showHeader = true;
    },
    removeShowHeader(state) {
      state.showHeader = false;
    },
    setLoading(state) {
      state.loading = true;
    },
    removeLoading(state) {
      state.loading = false;
    },
    setSearches(state, { searches }) {
      state.searches = searches;
    },
    setNewsletters(state, { newsletters }) {
      state.newsletters = newsletters;
    },
    setSearch(state, { search }) {
      state.search = search;
      Cookies.set("search", search, { sameSite: "strict", secure: true });
    },
    removeSearch(state) {
      state.search = {};
      Cookies.remove("search");
    },
    removeNewsletter(state) {
      state.newsletter = {};
      Cookies.remove("newsletter");
    },
    setNewsletter(state, { newsletter }) {
      state.newsletter = newsletter;
      Cookies.set("newsletter", newsletter, { sameSite: "strict", secure: true });
    },
    setResults(state, { results }) {
      state.results = results;
    },
  },
  actions: {
    login({ commit }, { name, password }) {
      return new Promise((resolve, reject) => {
        axios
          .post("/api/user/login", {
            name: name,
            password: password,
          })
          .then(() => {
            commit("setLoggedIn");
            resolve(router.push({ name: "searches" }));
          })
          .catch((err) => reject(err.response.data));
      });
    },
    logout({ commit }) {
      return new Promise((resolve, reject) => {
        axios
          .post("/api/user/logout")
          .then(() => {
            commit("removeLoggedIn");
            resolve();
          })
          .catch((err) => reject(err.response.data));
      });
    },
    getSearches({ commit }) {
      return new Promise((resolve, reject) => {
        axios
          .get("/api/search")
          .then((res) => {
            commit("setSearches", { searches: res.data.output.mongo });
            resolve();
          })
          .catch((err) => reject(err.response.data));
      });
    },
    getNewsletters({ commit }) {
      return new Promise((resolve, reject) => {
        axios
          .get("/api/newsletter")
          .then((res) => {
            commit("setNewsletters", { newsletters: res.data.output.mongo });
            resolve();
          })
          .catch((err) => reject(err.response.data));
      });
    },
    deleteSearch({ commit, state }, { search_ids }) {
      return new Promise((resolve, reject) => {
        axios
          .delete("/api/search", { data: { search_ids: search_ids } })
          .then(() => {
            const updatedSearches = state.searches.filter(
              (search) => !search_ids.includes(search._id)
            );
            commit("setSearches", { searches: updatedSearches });
            resolve();
          })
          .catch((err) => reject(err.response.data));
      });
    },
    deleteNewsletter({ commit, state }, { name }) {
      return new Promise((resolve, reject) => {
        axios
          .delete("/api/newsletter", { data: { name: name } })
          .then(() => {
            const updatedNewsletters = state.newsletters.filter(
              (newsletter) => newsletter.name !== name
            );
            commit("setNewsletters", { newsletters: updatedNewsletters });
            resolve();
          })
          .catch((err) => reject(err.response.data));
      });
    },
    runScraper({ commit }, { search_ids }) {
      return new Promise((resolve, reject) => {
        commit("setLoading");
        axios
          .post("/api/search/scrape", { search_ids: search_ids })
          .then((res) => {
            commit("setResults", { results: res.data.output.mongo });
            resolve();
          })
          .catch((err) => reject(err.response.data.output))
          .finally(() => commit("removeLoading"));
      });
    },
    getResults({ commit }, { search_id }) {
      return new Promise((resolve, reject) => {
        commit("setLoading");
        axios
          .post("/api/search/results", { search_id: search_id })
          .then((res) => {
            commit("setResults", { results: res.data.output.mongo });
            resolve();
          })
          .catch((err) => reject(err.response.data.output))
          .finally(() => commit("removeLoading"));
      });
    },
  },
  modules: {},
});
