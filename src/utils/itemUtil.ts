import { Item, RawItem, ItemPropertyNameKey, NormalizedProperties, ItemType, SocketProperties, ItemLineContent, ItemMod, ItemModType } from '@/models/item';

/**
 * Initialize potential missing properties with default values before decorating the item
 * @param raw raw item to init
 */
const initDefaultValue = (raw: RawItem): RawItem => ({
  ...raw,
  implicitMods: raw.implicitMods || [],
  explicitMods: raw.explicitMods || [],
  enchantMods: raw.enchantMods || [],
  craftedMods: raw.craftedMods || [],
  fracturedMods: raw.fracturedMods || [],
  influences: raw.influences || {},
});

/**
 * Given an raw item from response json, decorate the item with more computed properties
 * @param raw Raw item to decorate
 */
export const decorateItem = (raw: RawItem): Item => {
  raw = initDefaultValue(raw);
  return {
    ...raw,
    socketedItems: (raw.socketedItems || []).map(decorateItem),
    gemName: raw.frameType === ItemType.GEM ? raw.typeLine : '',
    ...normalizeItemProperties(raw),
    ...computedSocketsProperties(raw),
    parsedMods: {
      explicitMods: parseItemMods(raw.explicitMods, ItemModType.Explicit),
      implicitMods: parseItemMods(raw.implicitMods, ItemModType.Implicit),
      craftedMods: parseItemMods(raw.craftedMods, ItemModType.Crafted),
      enchantedMods: parseItemMods(raw.enchantMods, ItemModType.Enchanted, true),
      fracturedMods: parseItemMods(raw.fracturedMods, ItemModType.Fractured),
    }
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

/**
 *
 * @param rawMods array containing the raw mod strings
 * @param modType type of mod from enum ItemModType
 * @param skipParseValue whether parser should skip parsing the numeric value of the mod. If true, the entire mod string will be returned as is.
 */
const parseItemMods = (rawMods: string[], type: ItemModType, skipParseValue = false): ItemMod[] => {
  const regex = /(\d+(\.\d+)?)/g;
  return rawMods.map(rawModString => {
    const id = rawModString.replace(regex, '#');
    const values: number[] = [];
    const averageValue = 0;

    if(!skipParseValue) {
      let m;
      while((m = regex.exec(rawModString))!= null ){
        values.push(parseFloat(m[0]));
      }
    }

    return {
      type,
      id,
      values,
      fullText: rawModString,
      averageValue,
    }
  });
}
