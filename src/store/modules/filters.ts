import { getStoreBuilder } from "vuex-typex";
import { RootState } from "../store";
import { MODULES, Status } from "@/constants";
import {
  Filter,
  IndexerFilterType,
  FunctionalFilterType,
  createFilter,
  indexerFilters,
  functionalFilters
} from '@/models/filterTypes';
import itemStore from '@/indexer/itemStore';

export interface FilterState {
  indexerFilter: Filter<IndexerFilterType>[];

  functionalFilters: Filter<FunctionalFilterType>[];

  /**
   * If any filter is active.
   *
   * When false, session should render all tabs/characters.
   * Otherwise only render filtered results
   */
  filterActive: boolean;

  /**
   * filter results. a list of item ids
   */
  filterResults: string[];
}

export const initFilters: FilterState = {

  indexerFilter: indexerFilters.map(filter =>  createFilter(filter.type)),

  functionalFilters: functionalFilters.map(filter => createFilter(filter.type)),

  filterActive: false,
  filterResults: [],
}

const builder = getStoreBuilder<RootState>().module(MODULES.filters, initFilters);
const stateGetter = builder.state();


/************
 * Getters *
 ************/
const getIndexerFilter = builder.read(state =>
  (type: string) => state.indexerFilter.find(filter => filter.type === type),
'getIndexerFilter');

const getFunctionalFilter = builder.read(state =>
  (type: string) => state.functionalFilters.find(filter => filter.type === type),
'getFunctionalFilter');

const getFilter = builder.read(() =>
  (type: string) => getIndexerFilter()(type) || getFunctionalFilter()(type),
'getFilter');

/************
 * Actions *
 ************/
/**
 * Clear filter active status and reset all values
 */
const dispatchClearFilters = builder.dispatch(() => {
  filters.mutations.resetFilterValues();
  filters.mutations.setFilterActiveStatus(false);
  filters.mutations.setFilterResults([]);
}, 'dispatchClearFilters');

/**
 * Filter items using active filter and item store.
 * Update session with filtered results
 */
const dispatchFilterItems = builder.dispatch(async (context) => {
  filters.mutations.setFilterActiveStatus(true);
  let results: string[] = [];

  //first compute the results from text filter
  filters.state.indexerFilter
    // .filter(indexerFilter => indexerFilter.value)
    .forEach(indexerFilter => {
      results = [
        ...results,
        ...itemStore.queryByFilter(indexerFilter.type, indexerFilter.value)
      ];
  });
  results = itemStore.filterByFunctions(
    results,
    filters.state.functionalFilters.filter(f => f.enabled)
  );

  filters.mutations.setFilterResults(results);
}, 'dispatchFilterItems');

/**
 * Exported filter module
 */
export const filters = {

  get state() { return stateGetter() },

  mutations: {
    setFilterValue: builder.commit((state: FilterState, payload: { type: string, value: string } ) => {
      const filter = getFilter()(payload.type);
      if(filter) {
        filter.value = payload.value;
      }
    }, 'setFilterValue'),

    setFilterActiveStatus: builder.commit((state, activeState: boolean) => {
      state.filterActive = activeState;
    }, 'setFilterActiveStatus'),

    resetFilterValues: builder.commit((state) => {
      state.indexerFilter.forEach(filter => filter.value = undefined);
    }, 'resetFilterValues'),

    setFilterResults: builder.commit((state, filteredIds: string[]) => {
      state.filterResults = filteredIds;
    }, 'setFilterState'),

  },

  actions: {
    dispatchClearFilters,
    dispatchFilterItems,
  },

  getters: {
    getIndexerFilter,
    getFunctionalFilter,
    getFilter,
  },

};
