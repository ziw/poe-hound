<template>
  <div class="tab-bar">
    <single-tab v-for="tab in tabs" :tab="tab" :key="`${tab.league}-${tab.id}`" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import Tab from '@/models/tab';
import { session } from '@/store/modules/session';
import SingleTab from '@/components/main/stash/SingleTab.vue';

@Component({
  components: {
    SingleTab,
  },
})
export default class TabBar extends Vue {
  get tabs(): Tab[] {
    return session.getters.getFilteredStashTabs();
  }
}
</script>

<style lang="scss">
.tab-bar {
  position: relative;
  display: flex;
  flex-wrap: nowrap;
  overflow-x: auto;
  overflow-y: hidden;
  height: 50px;
  padding-bottom: 20px;
}
</style>
