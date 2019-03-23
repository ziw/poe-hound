<template>
  <span class="single-tab"
    @click="setSelectedTab"
    :class="{
      'single-tab__selected': this.isSelected,
    }">
    {{ tab.name }}
  </span>
</template>

<script lang="ts">
import Vue from 'vue'
import { Prop } from 'vue/types/options';
import Component from 'vue-class-component';
import Tab from '@/models/tab';
import { session } from '@/store/modules/session';

const AppProps = Vue.extend({
  props: {
     tab: Object as Prop<Tab>
  }
});

@Component({})
export default class SingleTab extends AppProps {

  get isSelected(): boolean{
    return this.tab.id === session.state.selectedTabId;
  }

  setSelectedTab() {
    session.mutations.setSelectedTabId(this.tab.id);
  }
}
</script>


<style lang="scss">
  .single-tab {
    box-sizing: border-box;
    padding: 2px 5px;
    cursor: pointer;

    &:hover {
      border-bottom: 1px solid rgba(255, 255, 255, 0.5);
    }

    &__selected,
    &__selected:hover {
      border-bottom: 1px solid #fff;
    }

  }

</style>

