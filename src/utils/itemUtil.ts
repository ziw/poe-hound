import { Item, RawItem, ItemPropertNameKey, NormalizedProperties } from '@/models/item';

/**
 * return a multi-lined string containing an item's
 * basic information to display in an element 'title' tooltip
 * @param item the item to display
 */
export const convertItemToTitle = (item: Item) => {
  return [
    item.name,
    item.typeLine,
    ...(item.enchantMods || []),
    ...(item.implicitMods || []),
    ...(item.explicitMods || []),
    ...(item.craftedMods || []),
    ...(item.identified ? [] : ['Unidentified']),
    ...(item.corrupted ? ['Corrupted'] : ''),
  ].join('\n');
};

/**
 * Given an raw item from response json, decorate the item with more computed properties
 * @param raw Raw item to decorate
 */
export const decorateItem = (raw: RawItem): Item => {
  return {
    ...raw,
    socketedItems: (raw.socketedItems || []).map(decorateItem),
    ...normalizeItemProperties(raw),
  };
};

/**
 * Iterate the properties field of an item and parse/normalize the value
 * @param raw Raw item to parse properties
 */
const normalizeItemProperties = (raw: RawItem): NormalizedProperties => {
  const properties: NormalizedProperties = {};
  if(!raw.properties) {
    return properties;
  }
  raw.properties.forEach(prop => {
    if(prop.name === ItemPropertNameKey.Quality) {
      properties.quality = parseFloat(prop.values[0][0]) || undefined;
    }else if(prop.name === ItemPropertNameKey.Level) {
      properties.level = parseInt(prop.values[0][0]) || undefined;
    }
  });
  return properties;
}
