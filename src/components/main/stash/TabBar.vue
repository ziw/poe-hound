<template>
  <div class="tab-bar">

  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component';
import { session } from '@/store/modules/session';

@Component({})
export default class TabBar extends Vue {

  get tabs() {
    return undefined;
  }

}
</script>

<style lang="scss">
  .tab-bar {

  }
</style>
