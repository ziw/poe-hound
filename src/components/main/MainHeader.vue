<template>
  <header class="main-header">
    <v-select
      class="main-header__league-select"
      @input="onLeagueSwitch"
      :searchable="false"
      :options="leagues"
      :value="currentLeagueName"
    ></v-select>
    <div class="main-header__right-section">
      <button class="main-header__logout-button" @click="logout">
        {{ labels.login.logout_button_label }}
      </button>
    </div>
  </header>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { session } from '@/store/modules/session';
import messages from '@/i18n';

@Component({})
export default class MainHeader extends Vue {
  labels = messages;

  get leagues() {
    return session.state.leagues.map((league) => league.name);
  }

  get currentLeagueName() {
    return session.state.currentLeagueName;
  }

  onLeagueSwitch(newLeagueName: string) {
    session.mutations.setCurrentLeagueName(newLeagueName);
    session.actions.loadAllCharInventoriesFromLeague(newLeagueName);
    session.actions.loadAllStashItemsFromLeague(newLeagueName);
  }

  logout() {
    this.$router.push('/').then(() => location.reload());
  }
}
</script>

<style lang="scss">
.main-header {
  height: 68px;
  background-image: radial-gradient(100% 100%, #620909 0%, #230202 100%);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;

  &__league-select {
    width: 150px;

    .clear {
      display: none;
    }
  }

  &__logout-button {
    background: none;
    border: none;
    cursor: pointer;
  }
}
</style>
