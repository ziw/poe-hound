<template>
  <div class="login-page">
    <login-logo />
    <img src="@/assets/gradient-border.png" class="login-page__divider" alt="" />
    <login-form v-on:offlineLogin="offlineLogin" v-on:login="tryLogin" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import LoginLogo from '@/components/login/LoginLogo.vue';
import LoginForm from '@/components/login/LoginForm.vue';
import { authentication } from '@/store/modules/authentication';
import { session } from '@/store/modules/session';

@Component({
  components: {
    LoginLogo,
    LoginForm,
  },
})
export default class LoginPage extends Vue {
  constructor() {
    super();
    authentication.createRootCacheDir();
  }

  async tryLogin(sessionId: string) {
    try {
      await authentication.login({ sessionId });
      await session.actions.dispatchLoadCharacters();
      await session.actions.dispatchLoadAllLeagueStashInfo();
      this.$router.push('/main');

      const currentLeagueName = session.state.currentLeagueName;
      await session.actions.loadAllCharInventoriesFromLeague(currentLeagueName);
      await session.actions.loadAllStashItemsFromLeague(currentLeagueName);
    } catch {}
  }

  async offlineLogin(accountName: string) {
    await authentication.offlineLogin({ accountName });
    await session.actions.dispatchLoadCharacters();
    await session.actions.dispatchLoadAllLeagueStashInfo();
    this.$router.push('/main');

    const currentLeagueName = session.state.currentLeagueName;
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

  &__divider {
    margin: 0px 45px;
  }
}
</style>
