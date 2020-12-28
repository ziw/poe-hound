import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store/store';
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';
import 'vue-select/dist/vue-select.css';

Vue.config.productionTip = false;

Vue.component('v-select', require('vue-select/dist/vue-select').VueSelect);
Vue.use(Antd);

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
