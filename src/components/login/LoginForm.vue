<template>
  <div class="login-form">
    <div>Session ID:</div>
    <form v-on:submit.prevent="login">
      <input v-model="sessionId" placeholder="session id">
      <button type="submit" :disabled="isLoading">Log in</button>
    </form>

    <div v-if="loggedIn">
      Logged in. Session ID {{ validSessionId }}
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { authentication } from '@/store/modules/authentication';

@Component({})
export default class LoginForm extends Vue {

  sessionId: string = '23d42f7d21ced9400eb82a9fa6b63339';

  get isLoading() {
    return authentication.state.isLoading;
  }

  get loggedIn() {
    return !!authentication.state.sessionId;
  }

  get validSessionId() {
    return authentication.state.sessionId;
  }

  login(){
    this.$emit('login', this.sessionId)
  }
}
</script>

<style lang="scss">
  .login-form{
    width: 500px;
    flex-grow: 0;
  }
</style>