<template>
  <v-select
    class="main-header__league-select"
    @input="inputUpdate"
    @search="onSearch"
    :searchable="true"
    :options="this.options"
    :value="filter.value"></v-select>
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

    filterType: String,
  }
});

@Component({
  components: {
    TextInput,
  }
})
export default class TextFilter extends AppProps {

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
