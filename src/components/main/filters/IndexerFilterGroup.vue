<template>
  <div class="indexer-filter-group">
    <div
      v-for="(filterInstance, i) in matchedFilters"
      class="indexer-filter-group__filter"
      :key="`${filterInstance.type}.${i}`"
    >
      <text-filter
        class="indexer-filter-group__input"
        v-on:filterUpdate="(filterValue) => onFilterUpdate(filterValue, filterInstance)"
        :filterType="filterInstance.type"
        :filterSerial="filterInstance.serial"
        :useCustomFilterFunction="true"
        :label="i === 0 ? label : undefined"
      />
      <div class="indexer-filter-group__range">
        <input
          type="text"
          class="indexer-filter-group__range-input"
          v-on:input="(e) => onRangeUpdate(filterInstance, e, 'minValue')"
          :placeholder="labels.min"
        />
        <input
          type="text"
          class="indexer-filter-group__range-input"
          v-on:input="(e) => onRangeUpdate(filterInstance, e, 'maxValue')"
          :placeholder="labels.max"
        />
      </div>
      <div class="indexer-filter-group__control">
        <a-icon
          type="close"
          v-if="i !== 0"
          @click="removeFilter(filterInstance)"
          class="indexer-filter-group__control--plus"
        />
        <a-icon
          type="plus"
          v-if="i === matchedFilters.length - 1 && matchedFilters.length < maxFilterCount"
          @click="addFilter(filterInstance)"
          class="indexer-filter-group__control--plus"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import TextFilter from '@/components/main/filters/TextFilter.vue';
import { filters } from '@/store/modules/filters';
import { Filter, IndexerFilterType, ModFilterValue } from '@/models/filterTypes';
import messages from '@/i18n';

const AppProps = Vue.extend({
  props: {
    label: String,
    filterType: String,
    maxFilterCount: Number,
  },
});

@Component({
  components: {
    TextFilter,
  },
})
export default class IndexerFilterGroup extends AppProps {
  labels = messages.filters;

  get matchedFilters() {
    return filters.state.indexerFilters.filter((f) => f.type === this.filterType);
  }

  addFilter(filterInstance: Filter<IndexerFilterType>) {
    filters.actions.addIndexerFilter(filterInstance.type);
  }

  removeFilter(filterInstance: Filter<IndexerFilterType>) {
    const { type, serial } = filterInstance;
    filters.actions.removeIndexerFilter({ type, serial });
  }

  onFilterUpdate(newFilterValue: string, filterInstance: Filter<IndexerFilterType>) {
    const { type, serial, value: oldValue } = filterInstance;
    const newValue: ModFilterValue = {
      ...oldValue,
      modId: newFilterValue,
    };
    filters.mutations.setFilterValue({
      type,
      serial,
      value: newValue,
    });
    filters.actions.filterItems();
  }

  onRangeUpdate(filterInstance: Filter<IndexerFilterType>, e: KeyboardEvent, property: string) {
    const rangeValue = parseInt((<HTMLInputElement>e.target).value ?? '') || undefined;
    const { type, serial, value: oldValue } = filterInstance;
    const newValue: ModFilterValue = {
      ...oldValue,
      [property]: rangeValue,
    };
    filters.mutations.setFilterValue({
      type,
      serial,
      value: newValue,
    });
    filters.actions.filterItems();
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

  &__range {
    width: 100px;
    padding: 0 5px;
    display: flex;
  }

  &__range-input {
    margin: 0 5px;
    width: 35px;
    height: 30px;
    border: none;
    outline: none;
    background: none;
    border-bottom: 1px solid #ffffff;
  }
}
</style>
