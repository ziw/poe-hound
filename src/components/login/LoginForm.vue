<template>
  <div class="login-form">
    <div>Session ID:</div>
    <form v-on:submit.prevent="login">
      <text-input v-model="sessionId" :disabled="loginButtonDisabled" class="login-form__session-input"/>
      <primary-button type="submit" stretch style-type="square" :disabled="loginButtonDisabled">
        {{loginButtonLabel}}
      </primary-button>
    </form>

    <div class="login-form__error">
      <img src="@/assets/error.svg" alt="" v-if="loginErrorMessage">
      <span v-if="loginErrorMessage">
        {{ loginErrorMessage }}
      </span>
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

  sessionId: string = '';
  loginButtonLabel: string = message.login.login_button_label;

  get loginButtonDisabled() {
    return authentication.state.isLoading;
  }

  get loggedIn() {
    return !!authentication.state.sessionId;
  }

  get loginErrorMessage() {
    return authentication.state.errorMessage;
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

    &__error {
      display: flex;
      justify-content: center;
      align-items: center;
      font-family:OpenSans-Semibold;
      font-size:14px;
      color:#ffffff;
      height: 40px;
      margin-top: 30px;

      img {
        margin-right: 15px;
      }
    }
  }
</style>