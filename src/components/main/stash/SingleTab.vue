<template>
  <span
    class="single-tab"
    @click="setSelectedTab"
    :class="{
      'single-tab__selected': this.isSelected,
      'single-tab__disabled': this.isDisabled,
    }"
  >
    {{ tab.name }}
  </span>
</template>

<script lang="ts">
import Vue from 'vue';
import { Prop } from 'vue/types/options';
import Component from 'vue-class-component';
import Tab from '@/models/tab';
import { session } from '@/store/modules/session';
import { Status } from '@/constants';

const AppProps = Vue.extend({
  props: {
    tab: Object as Prop<Tab>,
  },
});

@Component({})
export default class SingleTab extends AppProps {
  get isSelected(): boolean {
    return this.tab.id === session.state.selectedTabId;
  }

  get isDisabled(): boolean {
    return this.tab.status === Status.LOADING;
  }

  setSelectedTab() {
    if (!this.isDisabled) {
      session.mutations.setSelectedTabId(this.tab.id);
    }
  }
}
</script>

<style lang="scss">
.single-tab {
  box-sizing: border-box;
  padding: 2px 5px;
  cursor: pointer;
  white-space: nowrap;
  border: 1px solid rgba(255, 255, 255, 0);

  &:hover {
    border-color: rgba(255, 255, 255, 0.5);
  }

  &__selected,
  &__selected:hover {
    border-color: rgba(255, 255, 255, 1);
  }
}
</style>
