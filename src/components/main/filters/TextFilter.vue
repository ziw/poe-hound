<template>
  <div
    :class="{
      'text-filter': true,
    }"
  >
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
      :value="filterValue"
    ></v-select>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue/types/options';
import { filters } from '@/store/modules/filters';
import itemStore from '@/indexer/itemStore';
import { Filter } from '@/models/filterTypes';
import TextInput from '@/components/shared/TextInput.vue';
import { FilterBooleanOptions } from '@/constants';

const AppProps = Vue.extend({
  props: {
    label: String,
    filterType: String,
    filterSerial: Number,
    filterOptions: Array as Prop<string[]>,
    useCustomFilterFunction: Boolean,
    supportAnyOption: Boolean,
  },
});

@Component({
  components: {
    TextInput,
  },
})
export default class TextFilter extends AppProps {
  /**
   * the auto-complete options to show in the dropdown
   */
  options: string[] = [];

  constructor() {
    super();
    if (this.filterOptions) {
      this.options = this.filterOptions.slice();
    }
    filters.mutations.setFilterEnabledDisabled({
      type: this.filterType,
      value: true,
      serial: this.filterSerial,
    });
  }

  get filter() {
    return filters.getters.getFilter()(this.filterType, this.filterSerial);
  }

  get filterValue() {
    const value = this.filter?.value;
    return value?.modId ?? value;
  }

  onSearch() {
    if (this.filterOptions) {
      return;
    }
    this.options = itemStore.getFilterOptions(
      //@ts-ignore
      this.filter!.type,
      this.supportAnyOption,
    );
  }

  inputUpdate(value: string) {
    if (this.useCustomFilterFunction) {
      this.$emit('filterUpdate', value);
      return;
    }
    filters.mutations.setFilterValue({
      type: this.filterType,
      value,
      serial: this.filterSerial,
    });
    filters.actions.filterItems();
  }
}
</script>

<style lang="scss">
.text-filter {
  display: flex;

  label {
    display: flex;
    align-items: center;
    width: 65px;
    justify-content: flex-end;
  }

  &__input {
    flex-grow: 1;
    width: 100px;
  }
}
</style>
