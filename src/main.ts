import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store/store'

Vue.config.productionTip = false

Vue.component('v-select', require('vue-select/dist/vue-select').VueSelect);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
