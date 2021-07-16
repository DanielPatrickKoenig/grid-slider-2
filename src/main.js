import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import { library } from '@fortawesome/fontawesome-svg-core';
import { faBars, faStar, faTimes, faList, faTh } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

library.add(faBars);
library.add(faStar);
library.add(faTimes);
library.add(faList);
library.add(faTh);

Vue.component('font-awesome-icon', FontAwesomeIcon);