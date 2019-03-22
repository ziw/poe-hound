import Vue from 'vue'
import Router from 'vue-router'
import LoginPage from './views/LoginPage.vue';
import Main from './views/Main.vue';
import { authentication } from '@/store/modules/authentication';

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      name: 'login',
      component: LoginPage,
    },
    {
      path: '/main',
      name: 'main',
      component: Main,
      beforeEnter: (to, from, next) => {
        if(authentication.state.sessionId){
          next();
        }else{
          next('/');
        }
      }
    },
  ]
})

export default router;