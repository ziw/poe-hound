import Vue from 'vue'
import Router from 'vue-router'
import LoginPage from './views/LoginPage.vue';
import Main from './views/Main.vue';

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      name: 'login',
      component: LoginPage
    },
    {
      path: '/main',
      name: 'main',
      component: Main,
    }
  ]
})

export default router;