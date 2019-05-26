<template>
  <div :class="{
      'text-filter': true,
      ['text-filter__stretch']: this.stretch,
    }">
    <label>
      {{ label }}
    </label>
    <v-select
      :class="{
        'text-filter__input': true,

      }"
      @input="inputUpdate"
      @search="onSearch"
      :searchable="true"
      :options="this.options"
      :value="filter.value"></v-select>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component';
import { Prop } from 'vue/types/options';
import { filters } from '@/store/modules/filters';
import itemStore from '@/indexer/itemStore';
import { Filter, IndexerFilterType } from '@/models/filterTypes';
import TextInput from '@/components/shared/TextInput.vue';

const AppProps = Vue.extend({
  props: {
    label: String,
    stretch: Boolean,
    filterType: String,
  }
});

@Component({
  components: {
    TextInput,
  }
})
export default class TextFilter extends AppProps {

  /**
   * the auto-complete options to show in the dropdown
   */
  options: string[] = [];

  get filter() {
    return filters.getters.getTextFilter()(this.filterType);
  }

  onSearch() {
    this.options = itemStore.getFilterOptions(this.filter!.type);
  }

  inputUpdate(value: string) {
    filters.mutations.setTextFiltersValue({
      type: this.filterType,
      value,
    });
  }
}
</script>

<style lang="scss">
  .text-filter {
    display: flex;

    label{
      display: flex;
      align-items: center;
      width: 10%;
      justify-content: flex-end;
    }

    &__input {
      flex-grow: 1;
      padding-left: 10px;
    }
  }
</style>

