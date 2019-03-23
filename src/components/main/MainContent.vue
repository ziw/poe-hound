<template>
  <div class="main-content">
    <section class="main-content__filter-section">
      filters
    </section>

    <section class="main-content__stash-section">
      <tab-bar />
    </section>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component';
import TabBar from '@/components/main/stash/TabBar.vue';

@Component({
  components: {
    TabBar,
  }
})
export default class MainContent extends Vue {
}
</script>

<style lang="scss">

  $stash-section-width: 720px;

  .main-content {
    display: flex;
    flex-grow: 1;
    padding: 15px;

    &__filter-section {
      flex-grow: 1;
    }

    &__stash-section {
      width: $stash-section-width;
      flex-basis: $stash-section-width;
      max-width: $stash-section-width;
      flex-grow: 0;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }
  }
</style>
