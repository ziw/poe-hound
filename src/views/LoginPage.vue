<template>
  <div>
    <div>Session ID:</div>
    <input v-model="sessionId" placeholder="session id">
    <button @click="login" :disabled="isLoading">Log in</button>

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
export default class LoginPage extends Vue {
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
    authentication.login({
      sessionId: this.sessionId
    });
  }
}
</script>