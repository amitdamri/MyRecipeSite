import Vue from "vue";
import App from "./App.vue";
import VueAxios from "vue-axios";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";

import VueRouter from "vue-router";
Vue.use(VueRouter);
import routes from "./routes";
const router = new VueRouter({
  routes,
});

import VueCookies from "vue-cookies";
Vue.use(VueCookies);

import Vuelidate from "vuelidate";
//import Navbar from "./Navbar";
//Vue.component("Navbar", Navbar);

//bootstrap
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";
import {
  FormGroupPlugin,
  FormPlugin,
  FormInputPlugin,
  ButtonPlugin,
  CardPlugin,
  NavbarPlugin,
  FormSelectPlugin,
  AlertPlugin,
  ToastPlugin,
  LayoutPlugin,
  SpinnerPlugin,
  JumbotronPlugin,
  ModalPlugin,
  OverlayPlugin,
  IconsPlugin,
} from "bootstrap-vue";
[
  FormGroupPlugin,
  FormPlugin,
  FormInputPlugin,
  ButtonPlugin,
  CardPlugin,
  NavbarPlugin,
  FormSelectPlugin,
  AlertPlugin,
  ToastPlugin,
  LayoutPlugin,
  SpinnerPlugin,
  JumbotronPlugin,
  ModalPlugin,
  OverlayPlugin,
  IconsPlugin,
].forEach((x) => Vue.use(x));
Vue.use(Vuelidate);

axios.interceptors.request.use(
  function(config) {
    // Do something before request is sent
    if (shared_data.username && !$cookies.get("session")) {
      shared_data.logout();
    }
    return config;
  },
  function(error) {
    // Do something with request error
    return Promise.reject(error);
  }
);

// Add a response interceptor
axios.interceptors.response.use(
  function(response) {
    // Do something with response data
    return response;
  },
  function(error) {
    // Do something with response error
    return Promise.reject(error);
  }
);

axios.defaults.withCredentials = true;

Vue.use(VueAxios, axios);

Vue.config.productionTip = false;

const shared_data = {
  username: localStorage.username,
  searchLastResults: localStorage.searchLastResults,

  login(username) {
    localStorage.setItem("username", username);
    this.username = username;
    this.searchLastResults = undefined;
    console.log("login", this.username);
  },

  logout() {
    console.log("logout");
    localStorage.removeItem("username");
    if (localStorage.searchLastResults)
      localStorage.removeItem("searchLastResults");
    this.username = undefined;
    this.searchLastResults = undefined;
  },

  setLastSearch(recipes) {
    localStorage.setItem("searchLastResults", JSON.stringify(recipes));
    this.searchLastResults = localStorage.getItem("searchLastResults");
  },

  checkValidCookie() {
    if (this.$root.store.username && !this.$cookies.get("session")) {
      this.$root.store.logout();
    }
  }
};
console.log(shared_data);
// Vue.prototype.$root.store = shared_data;

import Navbar from "./components/Navbar";
Vue.component("Navbar", Navbar);

new Vue({
  router,
  Navbar,
  data() {
    return {
      store: shared_data,
    };
  },
  methods: {
    toast(title, content, variant = null, append = false) {
      this.$bvToast.toast(`${content}`, {
        title: `${title}`,
        toaster: "b-toaster-top-center",
        variant: variant,
        solid: true,
        appendToast: append,
        autoHideDelay: 3000,
      });
    },
  },
  render: (h) => h(App),
}).$mount("#app");
