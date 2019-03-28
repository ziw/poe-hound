import { getStoreBuilder } from "vuex-typex";
import { RootState } from "../store";
import { MODULES, Status } from "@/constants";
import { Filter, IndexerFilterType, FunctionalFilterType, createFilter } from '@/models/filterTypes';

export interface FilterState {
  textFilters: Filter<IndexerFilterType>[];
  simpleFilters: Filter<FunctionalFilterType>[];
}

export const initFilters: FilterState = {
  textFilters: [
    createFilter(IndexerFilterType.name),
  ],
  simpleFilters: [
    createFilter(FunctionalFilterType.shaped),
  ],
}

const builder = getStoreBuilder<RootState>().module(MODULES.filters, initFilters);
const stateGetter = builder.state();


/************
 * Getters *
 ************/
const getTextFilter = builder.read(state =>
  (type: string) => state.textFilters.find(filter => filter.type === type),
'getTextFilter');


export const filters = {

  get state() { return stateGetter() },

  mutations: {
    setTextFiltersValue: builder.commit((state: FilterState, payload: { type: string, value: string } ) => {
      const filter = getTextFilter()(payload.type);
      if(filter) {
        filter.value = payload.value;

      }
    }, 'setTextFiltersValue'),

  },

  getters: {
    getTextFilter,
  }

};