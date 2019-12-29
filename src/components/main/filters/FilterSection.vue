<template>
<div class="filter-section">
  <div class="filter-section__title">{{ sectionTitle }}</div>
  <div class="filter-section__slot">
    <slot></slot>
  </div>
</div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component';

const AppProps = Vue.extend({
  props: {
    sectionTitle: String,
  }
});

export default class FilterSection extends AppProps {
}
</script>

<style lang="scss" scoped>
  .filter-section {

    padding: 10px 0px;

    &__title {
      width: 50%;
      text-align: left;
      font-weight: bold;
    }

    &__slot {
      padding-left: 20px;
      display: flex;
      flex-wrap: wrap;
    }
  }
</style>