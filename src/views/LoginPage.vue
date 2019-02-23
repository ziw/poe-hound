<template>
  <div class="login-page">
    <login-logo />
    <img src="@/assets/gradient-border.png"
         class="login-page__divider" alt="">
    <login-form v-on:login="tryLogin" />
  </div>

</template>


<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import LoginLogo from '@/components/login/LoginLogo.vue';
import LoginForm from '@/components/login/LoginForm.vue';
import { authentication } from '@/store/modules/authentication';

@Component({
  components: {
    LoginLogo,
    LoginForm,
  }
})
export default class LoginPage extends Vue {

  tryLogin(sessionId: string){
    authentication.login({ sessionId }).then(() => {
      this.$router.push({ path: '/main'});
    });
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
