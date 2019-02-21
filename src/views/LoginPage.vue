<template>
  <div class="login-page">
    <Logo />
    <img src="@/assets/gradient-border.png"
         class="login-page__divider" alt="">
    <LoginForm v-on:login="tryLogin" />
  </div>

</template>


<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import Logo from '@/components/login/Logo.vue';
import LoginForm from '@/components/login/LoginForm.vue';
import { authentication } from '@/store/modules/authentication';

@Component({
  components: {
    Logo,
    LoginForm,
  }
})
export default class LoginPage extends Vue {

  tryLogin(sessionId: string){
    authentication.login({
      sessionId
    })
  }
}
</script>

<style lang="scss">
  .login-page {
    display: flex;
    height: 100%;
    align-items: center;
    justify-content: center;
    padding: 0px 35px;

  &__divider{
    margin: 0px 45px;
  }

  }
</style>
