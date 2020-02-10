import {
  Item,
  ItemLineContent,
  ItemMod,
  ItemModType,
  ItemType,
  NormalizedProperties,
  RawItem,
  SocketProperties,
} from '@/models/item';
import { RECOVERY_FLASKS } from '@/constants';

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
    currencyName: raw.frameType === ItemType.CURRENCY ? raw.typeLine : '',
    parsedTypeLine: parseTypeLine(raw),
    ...normalizeItemProperties(raw),
    ...computedSocketsProperties(raw),
    parsedMods: {
      explicitMods: parseItemMods(raw.explicitMods, ItemModType.Explicit),
      implicitMods: parseItemMods(raw.implicitMods, ItemModType.Implicit),
      craftedMods: parseItemMods(raw.craftedMods, ItemModType.Crafted),
      enchantedMods: parseItemMods(raw.enchantMods, ItemModType.Enchanted),
      fracturedMods: parseItemMods(raw.fracturedMods, ItemModType.Fractured),
    }
  };
};

/**
 * Given a raw item, return a parsed typeLine name
 * 1) Return a parsed flask name without prefix/suffix if item is flask
 * 2) //TODO parse non-flask typeLine of magic rarity
 * @param raw raw item to parse
 */
const parseTypeLine = (raw: RawItem) => {
  const { descrText, typeLine } = raw;
  if(descrText && descrText.includes('Right click to drink')) {
    //item is a flask
    const matchedRecoveryFlask = RECOVERY_FLASKS.find(flaskBaseName => typeLine.includes(flaskBaseName));
    const words = typeLine.split(' ');
    const index = words.indexOf('Flask');
    const flaskNames = matchedRecoveryFlask ?
                        //recovery flask has an extra base name modifier. e.g. small, large, divine, eternal etc.
                        [ words[index -2], words[index -1], 'Flask' ]

                        //utility flask
                        : [ words[index -1], 'Flask' ];
    return flaskNames.join(' ');
  }

  //non-flask item
  return typeLine;
}

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
  const propertyMapper: { [k: string]: keyof NormalizedProperties } = {
    Level: 'level',
    Quality: 'quality',
    Armour: 'armour',
    EnergyShield: 'energyShield',
    EvasionRating: 'evasion',
  };

  const requirementMapper: { [k: string]: keyof NormalizedProperties } = {
    Str: 'requiredStr',
    Dex: 'requiredDex',
    Int: 'requiredInt',
    Level: 'requiredLevel',
  };

  //parse properites. e.g. quality, gem level, evasion, armor or ES
  (raw.properties || []).forEach(prop => {
    const name = prop.name.replace(/\s+/, '');
    const propKey = propertyMapper[name];
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
    let averageValue = 0;

    if(!skipParseValue) {
      let m;
      let total = 0;
      while((m = regex.exec(rawModString))!= null ){
        const val = parseFloat(m[0]);
        values.push(val);
        total += val;
      }
      //TODO. Fix how mod with multiple numbers are calculated. Taking average is an initial solution.
      //It's missing some edge cases such as when two numbers in a mod are not related at all
      //i.e. # change to trigger level # molten burst on hit
      averageValue = Math.floor(total/values.length);
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
