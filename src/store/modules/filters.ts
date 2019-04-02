import { getStoreBuilder } from "vuex-typex";
import { RootState } from "../store";
import { MODULES, Status } from "@/constants";
import { Filter, IndexerFilterType, FunctionalFilterType, createFilter } from '@/models/filterTypes';
import itemStore from '@/indexer/itemStore';

export interface FilterState {
  textFilters: Filter<IndexerFilterType>[];

  simpleFilters: Filter<FunctionalFilterType>[];

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
  textFilters: [
    createFilter(IndexerFilterType.name),
  ],
  simpleFilters: [
    createFilter(FunctionalFilterType.shaped),
  ],
  filterActive: false,
  filterResults: [],
}

const builder = getStoreBuilder<RootState>().module(MODULES.filters, initFilters);
const stateGetter = builder.state();


/************
 * Getters *
 ************/
const getTextFilter = builder.read(state =>
  (type: string) => state.textFilters.find(filter => filter.type === type),
'getTextFilter');

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
  filters.state.textFilters
    .filter(textFilter => textFilter.value)
    .forEach(textFilter => {
      results = [
        ...results,
        ...itemStore.queryByFilter(textFilter.type, textFilter.value)
      ];
  });

  filters.mutations.setFilterResults(results);
}, 'dispatchFilterItems');

/**
 * Exported filter module
 */
export const filters = {

  get state() { return stateGetter() },

  mutations: {
    setTextFiltersValue: builder.commit((state: FilterState, payload: { type: string, value: string } ) => {
      const filter = getTextFilter()(payload.type);
      if(filter) {
        filter.value = payload.value;

      }
    }, 'setTextFiltersValue'),

    setFilterActiveStatus: builder.commit((state, activeState: boolean) => {
      state.filterActive = activeState;
    }, 'setFilterActiveStatus'),

    resetFilterValues: builder.commit((state) => {
      state.textFilters.forEach(filter => filter.value = undefined);
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
    getTextFilter,
  },

};