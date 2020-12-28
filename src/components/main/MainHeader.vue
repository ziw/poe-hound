<template>
  <header class="main-header">
    <v-select
      class="main-header__league-select"
      @input="onLeagueSwitch"
      :searchable="false"
      :options="leagues"
      :value="currentLeagueName"
    ></v-select>
  </header>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { session } from '@/store/modules/session';

@Component({})
export default class MainHeader extends Vue {
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
}
</script>

<style lang="scss">
.main-header {
  height: 68px;
  background-image: radial-gradient(100% 100%, #620909 0%, #230202 100%);
  display: flex;
  align-items: center;
  padding: 0 20px;

  &__league-select {
    width: 150px;

    .clear {
      display: none;
    }
  }
}
</style>
