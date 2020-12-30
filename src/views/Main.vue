<template>
  <div class="main-page">
    <main-header></main-header>
    <main-content></main-content>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import MainHeader from '@/components/main/MainHeader.vue';
import MainContent from '@/components/main/MainContent.vue';

@Component({
  components: {
    MainHeader,
    MainContent,
  },
})
export default class Main extends Vue {}
</script>

<style lang="scss">
.main-page {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  &__logout-button {
    position: absolute;
  }
}
</style>
