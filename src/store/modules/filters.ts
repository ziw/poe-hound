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
import { intersection } from '@/utils';

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
  filterResults: Set<string>;
}

export const initFilters: FilterState = {

  indexerFilter: indexerFilters.map(filter =>  createFilter(filter.type)),

  functionalFilters: functionalFilters.map(filter => createFilter(filter.type)),

  filterActive: false,
  filterResults: new Set(),
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
const clearFilters = builder.dispatch(() => {
  filters.mutations.resetFilterValues();
  filters.mutations.setFilterActiveStatus(false);
  filters.mutations.setFilterResults(new Set());
}, 'clearFilters');

/**
 * Filter items using active filter and item store.
 * Update session with filtered results
 */
const filterItems = builder.dispatch(async () => {
  filters.mutations.setFilterActiveStatus(true);
  let resultsSet: Set<string> = new Set();
  const validIndexerFilters = filters.state.indexerFilter.filter(indexerFilter =>
    indexerFilter.value && indexerFilter.enabled);

  // first filter by indexer filters
  if(validIndexerFilters.length){
    validIndexerFilters.forEach((indexerFilter, i) => {
      const filteredResult = itemStore.queryIndexerResults(indexerFilter.type, indexerFilter.value);
      resultsSet = i === 0 ? filteredResult : intersection(resultsSet, filteredResult);
    });
  }else{
    resultsSet = itemStore.getAllItemIds();
  }

  // then filter by functional filters
  resultsSet = itemStore.filterByFunctions(
    [...resultsSet],
    filters.state.functionalFilters.filter(f => f.enabled && f.value != undefined)
  );

  filters.mutations.setFilterResults(resultsSet);
}, 'filterItems');

/**
 * Exported filter module
 */
export const filters = {

  get state() { return stateGetter() },

  mutations: {
    setFilterValue: builder.commit((state: FilterState, payload: { type: string, value: any } ) => {
      const filter = getFilter()(payload.type);
      if(filter) {
        filter.value = payload.value;
      }
    }, 'setFilterValue'),

    setFilterEnabledDisabled: builder.commit((state, payload: { type: string, value: boolean }) => {
      const filter = getFilter()(payload.type);
      if(filter) {
        filter.enabled = payload.value;
      }
    }, 'setFilterEnabledDisabled'),

    setFilterActiveStatus: builder.commit((state, activeState: boolean) => {
      state.filterActive = activeState;
    }, 'setFilterActiveStatus'),

    resetFilterValues: builder.commit((state) => {
      [...state.indexerFilter, ...state.functionalFilters].forEach(filter => filter.value = undefined);
    }, 'resetFilterValues'),

    setFilterResults: builder.commit((state, filteredIds: Set<string>) => {
      state.filterResults = filteredIds;
    }, 'setFilterState'),

  },

  actions: {
    clearFilters,
    filterItems,
  },

  getters: {
    getIndexerFilter,
    getFunctionalFilter,
    getFilter,
  },

};
