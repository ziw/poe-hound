import { Item, RawItem, ItemPropertyNameKey, NormalizedProperties, ItemType, SocketProperties, ItemLineContent } from '@/models/item';

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
    influences: raw.influences || {},
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
  let hasWhiteSocket = false;
  const linkGroups: { [key: number]: number} = {};
  sockets.forEach(({ group, sColour }) => {
    if(sColour === 'A') {
      hasAbyssalSocket = true;
    }
    if(sColour === 'W') {
      hasWhiteSocket = true;
    }
    const count = linkGroups[group];
    linkGroups[group] = count ? count + 1 : 1;
  });

  return {
    numOfLinks: sockets.length ? Math.max(...Object.values(linkGroups)) : 0,
    numOfSockets,
    hasAbyssalSocket,
    hasWhiteSocket,
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

  const parsePropValue = (prop: ItemLineContent, defaultValue?: number) => parseInt(prop.values[0][0]) || defaultValue;
  const propertyMapper: { [k in keyof typeof ItemPropertyNameKey]?: keyof NormalizedProperties } = {
    [ItemPropertyNameKey.Level]: 'level',
    [ItemPropertyNameKey.Quality]: 'quality',
  };

  const requirementMapper: { [k in keyof typeof ItemPropertyNameKey]?: keyof NormalizedProperties } = {
    [ItemPropertyNameKey.Str]: 'requiredStr',
    [ItemPropertyNameKey.Dex]: 'requiredDex',
    [ItemPropertyNameKey.Int]: 'requiredInt',
    [ItemPropertyNameKey.Level]: 'requiredLevel',
  };

  //parse properites. e.g. quality, gem level, evasion, armor or ES
  (raw.properties || []).forEach(prop => {
    const propKey = propertyMapper[prop.name];
    if(propKey){
      properties[propKey] = parsePropValue(prop);
    }
  });

  //parse requirements. e.g. character level, str, dex or int
  (raw.requirements || []).forEach(req => {
    const reqKey = requirementMapper[req.name];
    if(reqKey) {
      properties[reqKey] = parsePropValue(req);
    }
  });
  return properties;
}
