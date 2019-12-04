import { Item, RawItem, ItemPropertNameKey, NormalizedProperties, ItemType, SocketProperties } from '@/models/item';

/**
 * return a multi-lined string containing an item's
 * basic information to display in an element 'title' tooltip
 * @param item the item to display
 */
export const convertItemToTitle = (item: Item) => {
  return [
    item.name,
    item.typeLine,
    item.quality ? `Quality: +${item.quality}%` : '',
    ...(item.enchantMods || []),
    ...(item.implicitMods || []),
    ...(item.explicitMods || []),
    ...(item.craftedMods || []),
    ...(item.identified ? [] : ['Unidentified']),
    ...(item.corrupted ? ['Corrupted'] : ''),
    item.id,
  ].join('\n');
};

/**
 * Given an raw item from response json, decorate the item with more computed properties
 * @param raw Raw item to decorate
 */
export const decorateItem = (raw: RawItem): Item => {
  return {
    ...raw,
    implicitMods: raw.implicitMods || [],
    explicitMods: raw.explicitMods || [],
    enchantMods: raw.enchantMods || [],
    craftedMods: raw.craftedMods || [],
    fracturedMods: raw.fracturedMods || [],
    socketedItems: (raw.socketedItems || []).map(decorateItem),
    gemName: raw.frameType === ItemType.GEM ? raw.typeLine : '',
    ...normalizeItemProperties(raw),
    ...computedSocketsProperties(raw),
  };
};

/**
 * Iterate the sockets field of an item and parse the links/sockets related values
 * @param raw Raw item to parse properties
 */
const computedSocketsProperties = (raw: RawItem): SocketProperties  => {
  const sockets = raw.sockets || [];
  const numOfSockets = sockets.length;
  let hasAbyssalSocket = false;
  const linkGroups: { [key: number]: number} = {};
  sockets.forEach(({ group, sColour }) => {
    if(sColour === 'A') {
      hasAbyssalSocket = true;
    }
    const count = linkGroups[group];
    linkGroups[group] = count ? count + 1 : 1;
  });

  return {
    numOfLinks: sockets.length ? Math.max(...Object.values(linkGroups)) : 0,
    numOfSockets,
    hasAbyssalSocket,
  }
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
