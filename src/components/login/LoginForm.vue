<template>
  <div class="login-form">
    <div>Session ID:</div>
    <form v-on:submit.prevent="login">
      <text-input v-model="sessionId" class="login-form__session-input"/>
      <primary-button type="submit" stretch style-type="square" :disabled="loginButtonDisabled">
        {{loginButtonLabel}}
      </primary-button>
    </form>

    <div v-if="loggedIn">
      Logged in. Session ID {{ validSessionId }}
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import PrimaryButton from '@/components/shared/PrimaryButton.vue';
import TextInput from '@/components/shared/TextInput.vue';
import { authentication } from '@/store/modules/authentication';
import message from '@/i18n';

@Component({
  components: {
    PrimaryButton,
    TextInput,
  }
})
export default class LoginForm extends Vue {

  sessionId: string = '23d42f7d21ced9400eb82a9fa6b63339';
  loginButtonLabel: string = message.login.login_button_label;

  get loginButtonDisabled() {
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

    &__session-input {
      margin-bottom: 15px;
    }
  }
</style>