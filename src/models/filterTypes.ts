import { Item, ItemType } from './item';
import { createFunctionFilter } from '@/utils';
import { Type } from '@/utils/enumPicker';

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
  minQuality = 'minQuality',
  maxQuality = 'maxQuality',
  minLevel = 'minLevel',
  maxLevel = 'maxLevel',
}

export type Filter<T> = {
  type: T,
  value: any,
  enabled: boolean,
}

export const createFilter = <T extends (FunctionalFilterType | IndexerFilterType)>(type: T): Filter<T> => {
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
  shouldIndex?: (item: Item) => boolean,
}> = [
  {
    type: IndexerFilterType.name,
    getIndexKeys: item => [item.name, item.gemName],
    shouldIndex: item => {
      return Type.of(item).in(ItemType.UNIQUE, ItemType.GEM, ItemType.RELIC);
    }
  },
  {
    type: IndexerFilterType.typeLine,
    getIndexKeys: item => [item.typeLine],
    shouldIndex: item => {
      return Type.of(item).isNot(
        ItemType.GEM,
        ItemType.CURRENCY,
        ItemType.DIVINATION_CARD,
      );
    },
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
  {
    type: FunctionalFilterType.minQuality,
    filter: createFunctionFilter.ofMinValue(item => item.quality),
  },
  {
    type: FunctionalFilterType.maxQuality,
    filter: createFunctionFilter.ofMaxValue(item => item.quality),
  },
  {
    type: FunctionalFilterType.minLevel,
    filter: createFunctionFilter.ofMinValue(item => item.level),
  },
  {
    type: FunctionalFilterType.maxLevel,
    filter: createFunctionFilter.ofMaxValue(item => item.level),
  },
  {
    type: FunctionalFilterType.corrupted,
    filter: createFunctionFilter.ofBooleanValue(item => item.corrupted),
  }
];
