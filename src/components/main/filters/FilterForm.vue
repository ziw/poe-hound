<template>
  <form v-on:submit.prevent="filterItems" class="filter-form">
    <button type="button" @click="clearFilters">
      {{ labels.clear }}
    </button>
    <text-filter
      :filterType="indexFilterTypes.name"
      :label="labels.name"/>
    <div>
      <primary-button type="submit" stretch style-type="square">
        {{ labels.search }}
      </primary-button>
    </div>
  </form>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component';
import { session } from '@/store/modules/session';
import { filters } from '@/store/modules/filters';
import messages from '@/i18n';
import { IndexerFilterType } from '@/models/filterTypes';
import TextFilter from '@/components/main/filters/TextFilter.vue';
import PrimaryButton from '@/components/shared/PrimaryButton.vue';

@Component({
  components: {
    TextFilter,
    PrimaryButton,
  }
})
export default class FilterForm extends Vue {

  labels = messages.filters;
  indexFilterTypes = IndexerFilterType;

  filterItems() {
    filters.actions.dispatchFilterItems();
  }

  clearFilters() {
    filters.actions.dispatchClearFilters();
  }
}
</script>

<style lang="scss" scoped>
  .filter-form {
    display: block;
  }

</style>

