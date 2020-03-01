export type RawItem = {
  id: string;
  w: number;
  h: number;
  x: number;
  y: number;
  ilvl: number;
  frameType: ItemType;
  stackSize: number;
  maxStackSize: number;

  inventoryId: InventoryId;
  identified: boolean;
  corrupted: boolean;
  elder: boolean;
  shaper: boolean;
  fractured: boolean;
  isRelic: boolean;

  league: string;
  name: string;
  typeLine: string;
  icon: string;
  descrText: string;
  explicitMods: string[];
  implicitMods: string[];
  enchantMods: string[];
  craftedMods: string[];
  fracturedMods: string[];
  influences: { [k in Influence]: boolean };
  flavourText: string[];

  properties: ItemLineContent[];
  socketedItems: RawItem[];
  sockets: Socket[];
  requirements: ItemLineContent[];
};

export type NormalizedProperties = {
  quality?: number;
  level?: number;
  requiredLevel?: number,
  requiredStr?: number,
  requiredDex?: number,
  requiredInt?: number,
  armour?: number,
  evasion?: number,
  energyShield?: number,
}

export type SocketProperties = {
  numOfLinks: number,
  numOfSockets: number,
  hasAbyssalSocket: boolean,
  hasWhiteSocket: boolean,
  linkGroups: ScoketColor[][],
}

export type DecoratedNames = {
  gemName: string;
  currencyName: string;
  parsedTypeLine: string;
}

export type Item =
  RawItem &
  NormalizedProperties &
  DecoratedNames &
  SocketProperties &
  {
    socketedItems: Item[],
    parsedMods: {
      explicitMods: ItemMod[],
      implicitMods: ItemMod[],
      craftedMods: ItemMod[],
      enchantedMods: ItemMod[],
      fracturedMods: ItemMod[],
    }
  };

export type ItemLineContent = {
  name: string,
  values: ItemPropertyTuple[],
  displayMode: number,
  type: number,
}

type ItemPropertyTuple = [
  string,
  number,
];

export enum InventoryId {
  Belt= 'Belt',
  Amulet= 'Amulet',
  Flask= 'Flask',
  Boots= 'Boots',
  Helm= 'Helm',
  Gloves= 'Gloves',
  Ring= 'Ring',
  Ring2= 'Ring2',
  Weapon= 'Weapon',
  Weapon2= 'Weapon2',
  Offhand= 'Offhand',
  Offhand2= 'Offhand2',
  BodyArmour= 'BodyArmour',
  MainInventory= 'MainInventory',
  PassiveJewels = 'PassiveJewels',
};

export enum ItemType {
  NORMAL = 0,
  MAGIC = 1,
  RARE = 2,
  UNIQUE = 3,
  GEM = 4,
  CURRENCY = 5,
  DIVINATION_CARD = 6,
  PROPHECY = 8,
  RELIC = 9,
}

export enum Influence {
  Shaper = 'shaper',
  Elder = 'elder',
  Redeemer = 'redeemer',
  Hunter = 'hunter',
  Warlord = 'warlord',
  Crusader = 'crusader',
}

export type ScoketColor = 'R' | 'G' | 'B' | 'W' /* White */ | 'A'  /* Abyss */;

type Socket = {
  group: number,
  sColour: ScoketColor,
};

export enum ItemModType {
  Explicit = 'explicit',
  Implicit = 'implicit',
  Crafted = 'crafted',
  Enchanted = 'enchanted',
  Fractured = 'fractured',
}

export type ItemMod = {
  type: ItemModType,
  id: string,
  fullText: string,
  values: number[],
  averageValue: number,
}
