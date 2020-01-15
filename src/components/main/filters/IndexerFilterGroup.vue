<template>
  <div class="indexer-filter-group">
    <div v-for="(filterInstance, i) in matchedFilters"
        class="indexer-filter-group__filter"
        :key="`${filterInstance.type}.${i}`">
      <text-filter
        class="indexer-filter-group__input"
        :filterType="filterInstance.type"
        :filterSerial="filterInstance.serial"
        :label="i === 0 ? label : undefined"/>
      <div class="indexer-filter-group__control">
        <a-icon type="close"
          v-if="i !== 0"
          @click="removeFilter(filterInstance)"
          class="indexer-filter-group__control--plus"/>
        <a-icon type="plus"
          v-if="(i === (matchedFilters.length -1)) && matchedFilters.length < maxFilterCount "
          @click="addFilter(filterInstance)"
          class="indexer-filter-group__control--plus"/>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import TextFilter from '@/components/main/filters/TextFilter.vue';
import { filters } from '@/store/modules/filters';
import { Filter, IndexerFilterType } from '@/models/filterTypes';

const AppProps = Vue.extend({
  props: {
    label: String,
    filterType: String,
    maxFilterCount: Number,
  }
});

@Component({
  components: {
    TextFilter
  }
})
export default class IndexerFilterGroup extends AppProps {

  get matchedFilters() {
    return filters.state.indexerFilters.filter(f => f.type === this.filterType);
  }

  addFilter(filterInstance: Filter<IndexerFilterType>) {
    filters.actions.addIndexerFilter(filterInstance.type);
  }

  removeFilter(filterInstance: Filter<IndexerFilterType>) {
    const { type, serial } = filterInstance;
    filters.actions.removeIndexerFilter({ type, serial });
  }

}
</script>
<style lang="scss" scoped>
  .indexer-filter-group {

    &__filter {
      display: flex;
    }

    &__input {
      flex-grow: 1;
    }

    &__control {
      width: 50px;
      padding: 0 5px;
      display: flex;
      align-items: center;
      justify-content: space-between;

      i {
        cursor: pointer;
      }
    }
  }
</style>
