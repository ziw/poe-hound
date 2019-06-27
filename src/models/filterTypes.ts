import Item from './item';
import { createFunctionFilter } from '@/utils';

export enum IndexerFilterType {
  name= 'name',
  typeLine= 'typeLine',
}

export enum FunctionalFilterType {
  numSockets = 'numSockets',
  shaped = 'shaped',
  elder = 'elder',
  corrupted = 'corrupted',
  identified = 'identified',
  fractured = 'fractured',
}

export type Filter<T> = {
  type: T,
  value: any,
  enabled: boolean,
}

export const createFilter = <T>(type: T): Filter<T> => {
  return {
    type,
    value: undefined,
    enabled: false,
  };
}

/**
 * A list of filters with type IndexerFilterType whose
 * value needs to be indexed by itemStore before querying.
 */
export const indexerFilters: Array<{
  type: IndexerFilterType,
  getIndexKeys: (item: Item) => string[],
}> = [
  {
    type: IndexerFilterType.name,
    getIndexKeys: item => [item.name],
  },
  {
    type: IndexerFilterType.typeLine,
    getIndexKeys: item => [item.typeLine],
  },
];

/**
 * A list of filters with type FunctionalFilterType whose
 * filtering is done through a filtering function that returns a boolean value
 * to indicate if an item passes this filter.
 */
export const functionalFilters: Array<{
  type: FunctionalFilterType,
  filter: (item: Item, value: any) => boolean,
}> = [
  {
    type: FunctionalFilterType.shaped,
    filter: createFunctionFilter.ofBooleanValue(item => item.shaper),
  },
  {
    type: FunctionalFilterType.elder,
    filter: createFunctionFilter.ofBooleanValue(item => item.elder),
  },
  {
    type: FunctionalFilterType.corrupted,
    filter: createFunctionFilter.ofBooleanValue(item => item.corrupted),
  },
];
