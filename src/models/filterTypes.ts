import Item from './item';

export enum IndexerFilterType {
  name= 'name',
  typeLine= 'typeLine',
}

export enum FunctionalFilterType {
  numSockets= 'numSockets',
  shaped= 'shaped',
}

export type Filter<T> = {
  type: T,
  value: any,
  enabled?: boolean,
}

export const createFilter = <T>(type: T) => {
  return {
    type,
    value: undefined,
    enabled: true,
  } as Filter<T>;
}

/**
 * A list of filters with type IndexerFilterType whose
 * value needs to be indexed by itemStore before querying.
 */
export const indexerFilters: Array<{
  filterType: IndexerFilterType,
  getIndexKeys: (item: Item) => string[],
}> = [
  {
    filterType: IndexerFilterType.name,
    getIndexKeys: item => [item.name],
  },
  {
    filterType: IndexerFilterType.typeLine,
    getIndexKeys: item => [item.typeLine],
  },
];

/**
 * A list of filters with type FunctionalFilterType whose
 * filtering is done through a filtering function that returns a boolean value
 * to indicate if an item passes this filter.
 */
export const functionalFilters: Array<{
  filterType: FunctionalFilterType,
  filter: (item: Item, value: any) => boolean,
}> = [
 {
   filterType: FunctionalFilterType.shaped,
   filter: item => item.shaper,
 },
]
