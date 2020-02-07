import { Item, ItemType, Influence } from './item';
import { createFunctionFilter, matchItemCategory } from '@/utils';
import { Type } from '@/utils/enumPicker';

export enum IndexerFilterType {
  name= 'name',
  typeLine= 'typeLine',
  craftedMods = 'crafted',
  explicitMods = 'explicit',
  implicitMods = 'implicit',
  enchantedMods = 'enchanted',
  fracturedMods = 'fractured',
}

export enum FunctionalFilterType {
  shaped = 'shaped',
  elder = 'elder',
  hunter = 'hunter',
  redeemer = 'redeemer',
  warlord = 'warlord',
  crusader = 'crusader',
  corrupted = 'corrupted',
  identified = 'identified',
  fractured = 'fractured',
  minQuality = 'minQuality',
  maxQuality = 'maxQuality',
  minLevel = 'minLevel',
  maxLevel = 'maxLevel',
  minSockets = 'minSockets',
  maxSockets = 'maxSockets',
  minLinks = 'minLinks',
  maxLinks = 'maxLinks',
  hasWhiteSocket = 'hasWhiteSocket',
  hasAbyssalSocket = 'hasAbyssalSocket',
  minArmor = 'minArmor',
  maxArmor = 'maxArmor',
  minEvasion = 'minEvasion',
  maxEvasion = 'maxEvasion',
  minEnergyShield = 'minEnergyShield',
  maxEnergyShield = 'maxEnergyShield',
  category = 'category',
}

export type Filter<T> = {
  type: T,
  value: any,
  enabled: boolean,
  serial: number,
}

export const createFilter = <T extends (FunctionalFilterType | IndexerFilterType)>(type: T, serial = 0): Filter<T> => {
  return {
    type,
    value: undefined,
    enabled: false,
    serial,
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
    getIndexKeys: item => [ item.name, item.gemName, item.currencyName ],
    shouldIndex: item => Type.of(item).in(
      ItemType.UNIQUE,
      ItemType.GEM,
      ItemType.RELIC,
      ItemType.CURRENCY,
    ),
  },
  {
    type: IndexerFilterType.typeLine,
    getIndexKeys: item => [item.parsedTypeLine],
    shouldIndex: item => Type.of(item).isNot(
        ItemType.GEM,
        ItemType.CURRENCY,
        ItemType.DIVINATION_CARD,
    ),
  },
  {
    type: IndexerFilterType.implicitMods,
    getIndexKeys: item => item.parsedMods.implicitMods.map(m => m.id),
    shouldIndex: item => Type.of(item).isNot(
      ItemType.GEM,
      ItemType.CURRENCY,
      ItemType.DIVINATION_CARD,
    ),
  },
  {
    type: IndexerFilterType.explicitMods,
    getIndexKeys: item => item.parsedMods.explicitMods.map(m => m.id),
    shouldIndex: item => Type.of(item).isNot(
      ItemType.GEM,
      ItemType.CURRENCY,
      ItemType.DIVINATION_CARD,
    ),
  },
  {
    type: IndexerFilterType.craftedMods,
    getIndexKeys: item => item.parsedMods.craftedMods.map(m => m.id),
    shouldIndex: item => Type.of(item).isNot(
      ItemType.GEM,
      ItemType.CURRENCY,
      ItemType.DIVINATION_CARD,
    ),
  },
  {
    type: IndexerFilterType.enchantedMods,
    getIndexKeys: item => item.parsedMods.enchantedMods.map(m => m.id),
    shouldIndex: item => Type.of(item).isNot(
      ItemType.GEM,
      ItemType.CURRENCY,
      ItemType.DIVINATION_CARD,
    ),
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
    filter: createFunctionFilter.ofBooleanValue(item => item.influences[Influence.Shaper]),
  },
  {
    type: FunctionalFilterType.elder,
    filter: createFunctionFilter.ofBooleanValue(item => item.influences[Influence.Elder]),
  },
  {
    type: FunctionalFilterType.hunter,
    filter: createFunctionFilter.ofBooleanValue(item => item.influences[Influence.Hunter]),
  },
  {
    type: FunctionalFilterType.redeemer,
    filter: createFunctionFilter.ofBooleanValue(item => item.influences[Influence.Redeemer]),
  },
  {
    type: FunctionalFilterType.warlord,
    filter: createFunctionFilter.ofBooleanValue(item => item.influences[Influence.Warlord]),
  },
  {
    type: FunctionalFilterType.crusader,
    filter: createFunctionFilter.ofBooleanValue(item => item.influences[Influence.Crusader]),
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
  },
  {
    type: FunctionalFilterType.minSockets,
    filter: createFunctionFilter.ofMinValue(item => item.numOfSockets),
  },
  {
    type: FunctionalFilterType.maxSockets,
    filter: createFunctionFilter.ofMaxValue(item => item.numOfSockets),
  },
  {
    type: FunctionalFilterType.minLinks,
    filter: createFunctionFilter.ofMinValue(item => item.numOfLinks),
  },
  {
    type: FunctionalFilterType.maxLinks,
    filter: createFunctionFilter.ofMaxValue(item => item.numOfLinks),
  },
  {
    type: FunctionalFilterType.hasAbyssalSocket,
    filter: createFunctionFilter.ofBooleanValue(item => item.hasAbyssalSocket),
  },
  {
    type: FunctionalFilterType.hasWhiteSocket,
    filter: createFunctionFilter.ofBooleanValue(item => item.hasWhiteSocket),
  },
  {
    type: FunctionalFilterType.minArmor,
    filter: createFunctionFilter.ofMinValue(item => item.armour),
  },
  {
    type: FunctionalFilterType.maxArmor,
    filter: createFunctionFilter.ofMaxValue(item => item.armour),
  },
  {
    type: FunctionalFilterType.minEvasion,
    filter: createFunctionFilter.ofMinValue(item => item.evasion),
  },
  {
    type: FunctionalFilterType.maxEvasion,
    filter: createFunctionFilter.ofMaxValue(item => item.evasion),
  },
  {
    type: FunctionalFilterType.minEnergyShield,
    filter: createFunctionFilter.ofMinValue(item => item.energyShield),
  },
  {
    type: FunctionalFilterType.maxEnergyShield,
    filter: createFunctionFilter.ofMaxValue(item => item.energyShield),
  },
  {
    type: FunctionalFilterType.category,
    filter: matchItemCategory,
  }
];
