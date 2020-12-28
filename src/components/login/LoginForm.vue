<template>
  <div class="login-form">
    <div v-if="!offlineMode">
      <div>{{ message.login.session_id }}</div>
      <form v-on:submit.prevent="login">
        <text-input
          v-model="sessionId"
          :disabled="loginButtonDisabled"
          class="login-form__session-input"
        />
        <primary-button type="submit" stretch style-type="square" :disabled="loginButtonDisabled">
          {{ message.login.login_button_label }}
        </primary-button>
      </form>
    </div>
    <div v-else>
      <div>{{ message.login.account_name }}</div>
      <form v-on:submit.prevent="offlineLogin">
        <v-select
          class="login-form__account-input"
          v-model="accountName"
          :searchable="true"
          :options="this.offlineAccountOptions"
        >
        </v-select>
        <primary-button type="submit" stretch style-type="square" :disabled="loginButtonDisabled">
          {{ message.login.login_button_label }}
        </primary-button>
      </form>
    </div>
    <div class="login-form__offline-section">
      <a-switch v-model="offlineMode" />
      <span class="login-form__offline-label">{{ message.login.offline_label }}</span>
      <a-tooltip overlayClassName="login-form__offline-tooltip">
        <template slot="title">
          <span>{{ message.login.offline_tooltip }}</span>
        </template>
        <a-icon class="login-form__offline-label" type="question-circle" />
      </a-tooltip>
    </div>
    <div class="login-form__error">
      <img src="@/assets/error.svg" alt="" v-if="loginErrorMessage" />
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
  },
})
export default class LoginForm extends Vue {
  sessionId: string = '';
  accountName: string = '';
  message = message;
  offlineMode: boolean = false;

  get offlineAccountOptions() {
    return authentication.state.offlineAccounts;
  }

  get loginButtonDisabled() {
    return authentication.state.isLoading;
  }

  get loggedIn() {
    return !!authentication.state.sessionId;
  }

  get loginErrorMessage() {
    return authentication.state.errorMessage;
  }

  login() {
    this.$emit('login', this.sessionId);
  }

  offlineLogin() {
    this.$emit('offlineLogin', this.accountName);
  }
}
</script>

<style lang="scss">
.login-form {
  width: 500px;
  flex-grow: 0;

  &__session-input,
  &__account-input {
    margin-bottom: 15px;
  }

  &__error {
    display: flex;
    justify-content: center;
    align-items: center;
    font-family: OpenSans-Semibold;
    font-size: 14px;
    color: #ffffff;
    height: 40px;
    margin-top: 30px;

    img {
      margin-right: 15px;
    }
  }

  &__offline-section {
    margin-top: 20px;
  }

  &__offline-label {
    margin: 0 5px 10px 0;
  }

  &__offline-tooltip {
    .ant-tooltip-inner {
      padding: 6px 8px;
      background: rgba(0, 0, 0, 0.75);
    }
  }
}
</style>
