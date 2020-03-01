import { getStoreBuilder } from "vuex-typex";
import { RootState } from "@/store/store";
import { MODULES, OPTION_ANY } from "@/constants";
import {
  Filter,
  IndexerFilterType,
  FunctionalFilterType,
  createFilter,
  indexerFilters,
  functionalFilters,
  ModFilterValue,
  getIndexedMods
} from '@/models/filterTypes';
import itemStore from '@/indexer/itemStore';
import { intersection } from '@/utils';

export interface FilterState {
  indexerFilters: Filter<IndexerFilterType>[];

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

  indexerFilters: indexerFilters.map(filter =>  createFilter(filter.type)),

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
  (type: string, serial: number = 0) => state.indexerFilters.find(filter => filter.type === type && filter.serial === serial),
'getIndexerFilter');

const getFunctionalFilter = builder.read(state =>
  (type: string) => state.functionalFilters.find(filter => filter.type === type),
'getFunctionalFilter');

const getFilter = builder.read(() =>
  (type: string, serial?: number) => getIndexerFilter()(type, serial) || getFunctionalFilter()(type),
'getFilter');

/************
 * Actions *
 ************/
/**
 * Clear filter active status and reset all values
 */
const clearFilters = builder.dispatch(() => {
  filters.mutations.setIndexFilters(stateGetter().indexerFilters.filter(f => f.serial === 0));
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
  const validIndexerFilters = filters.state.indexerFilters.filter(({ enabled, value }) => {
    const keyword = value?.modId ?? value;
    return keyword && enabled;
  });

  // first filter by indexer filters
  if(validIndexerFilters.length){
    validIndexerFilters.forEach((indexerFilter, i) => {
      const rawFilterValue = indexerFilter.value;
      const keyword = rawFilterValue.modId ?? rawFilterValue;
      const filteredResult = itemStore.queryIndexerResults(indexerFilter.type, keyword === OPTION_ANY ? '' : keyword);
      resultsSet = i === 0 ? filteredResult : intersection(resultsSet, filteredResult);

      if(rawFilterValue.modId) {
        const {
          minValue = Number.MIN_SAFE_INTEGER,
          maxValue = Number.MAX_SAFE_INTEGER,
          modId,
        } = rawFilterValue as ModFilterValue;
        const rangeMatched = Array.from(resultsSet).filter(id => {
          const item = itemStore.getItemFromId(id);
          if(!item) return false;
          const matchedMod = getIndexedMods(indexerFilter.type, item).find(({ id }) => id === modId);
          return matchedMod ? (minValue <= matchedMod.averageValue && maxValue >= matchedMod.averageValue) : false;
        });
        resultsSet = intersection(resultsSet, new Set(rangeMatched));
      }
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
 * Add a new filter with a given type
 */
const addIndexerFilter = builder.dispatch((context, type: IndexerFilterType) => {
  const currentFilters = stateGetter().indexerFilters;
  const nextSerial = Math.max(...currentFilters.filter(f => f.type === type).map(f => f.serial));
  filters.mutations.setIndexFilters([...currentFilters, createFilter(type, nextSerial + 1)]);
}, 'addIndexerFilter');

/**
 * Remove an existing filter with a given type and serial number
 */
const removeIndexerFilter = builder.dispatch((context, payload: { type: IndexerFilterType, serial: number }) => {
  filters.mutations.setIndexFilters(
    stateGetter().indexerFilters.filter(f => f.type !== payload.type || f.serial !== payload.serial)
  );
}, 'removeIndexerFilter');

/**
 * Exported filter module
 */
export const filters = {

  get state() { return stateGetter() },

  mutations: {
    setFilterValue: builder.commit((state: FilterState, payload: { type: string, value: any, serial?: number } ) => {
      const filter = getFilter()(payload.type, payload.serial);
      if(filter) {
        filter.value = payload.value;
      }
    }, 'setFilterValue'),

    setFilterEnabledDisabled: builder.commit((state, payload: { type: string, value: boolean, serial?: number }) => {
      const filter = getFilter()(payload.type, payload.serial);
      if(filter) {
        filter.enabled = payload.value;
      }
    }, 'setFilterEnabledDisabled'),

    setFilterActiveStatus: builder.commit((state, activeState: boolean) => {
      state.filterActive = activeState;
    }, 'setFilterActiveStatus'),

    resetFilterValues: builder.commit((state) => {
      [...state.indexerFilters, ...state.functionalFilters].forEach(filter => filter.value = undefined);
    }, 'resetFilterValues'),

    setFilterResults: builder.commit((state, filteredIds: Set<string>) => {
      state.filterResults = filteredIds;
    }, 'setFilterState'),

    setIndexFilters: builder.commit((state, newIndexFilters: Filter<IndexerFilterType>[]) => {
      state.indexerFilters = newIndexFilters;
    }, 'setIndexFilters'),
  },

  actions: {
    clearFilters,
    filterItems,
    addIndexerFilter,
    removeIndexerFilter,
  },

  getters: {
    getIndexerFilter,
    getFunctionalFilter,
    getFilter,
  },

};
