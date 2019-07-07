<template>
  <div class="range-filter">
    <label>
      {{ label }}
    </label>
    <div class="range-filter__input-wrapper">
      <input type="text" class="range-filter__input"
        v-model="minValue"
        :placeholder="labels.min">
      <input type="text" class="range-filter__input"
        v-model="maxValue"
        :placeholder="labels.max">
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component';
import { filters } from '@/store/modules/filters';
import { Filter, FunctionalFilterType } from '@/models/filterTypes';
import messages from '@/i18n';

const AppProps = Vue.extend({
  props: {
    label: String,
    minFilterType: String,
    maxFilterType: String,
  }
})

@Component({})
export default class RangeFilter extends AppProps {
  labels = messages.filters;
  minFilter: Filter<FunctionalFilterType> | undefined;
  maxFilter: Filter<FunctionalFilterType> | undefined;

  constructor() {
    super();
    this.minFilter = filters.getters.getFunctionalFilter()(this.minFilterType);
    this.maxFilter = filters.getters.getFunctionalFilter()(this.maxFilterType);
    filters.mutations.setFilterEnabledDisabled({
      type: this.minFilterType,
      value: true,
    });
    filters.mutations.setFilterEnabledDisabled({
      type: this.maxFilterType,
      value: true,
    });
  }

  get minValue() {
    return this.minFilter ? this.minFilter.value : 0;
  }

  set minValue(minValue: string) {
    filters.mutations.setFilterValue({
      type: this.minFilterType,
      value: parseInt(minValue) || undefined,
    });
  }

  get maxValue() {
    return this.maxFilter ? this.maxFilter.value: 0;
  }

  set maxValue(maxValue: string) {
    filters.mutations.setFilterValue({
      type: this.maxFilterType,
      value: parseInt(maxValue) || undefined,
    });
  }

}
</script>

<style lang="scss" scoped>
  .range-filter {
    display: flex;

    label{
      display: flex;
      align-items: center;
      width: 65px;
      justify-content: flex-end;
    }

    &__input-wrapper {
      flex-grow: 1;
      width: 100px;
      display: flex;
    }

    &__input {
      margin: 0 5px;
      width: 50px;
      height: 30px;
      border: none;
      outline: none;
      background: none;
      border-bottom: 1px solid #ffffff;
    }
  }
</style>
