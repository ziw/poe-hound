<template>

  <text-input
    :id="filterType"
    :label="label"
    :value="filter.value"
    @input="inputUpdate"/>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component';
import { Prop } from 'vue/types/options';
import { filters } from '@/store/modules/filters';
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

  get filter() {
    return filters.getters.getTextFilter()(this.filterType);
  }


  inputUpdate(value: string) {
    filters.mutations.setTextFiltersValue({
      type: this.filterType,
      value,
    });
  }
}
</script>
