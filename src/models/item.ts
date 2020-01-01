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
  requirements: Requirement[];
};

export type NormalizedProperties = {
  quality?: number;
  level?: number;
}

export type SocketProperties = {
  numOfLinks: number,
  numOfSockets: number,
  hasAbyssalSocket: boolean,
  hasWhiteSocket: boolean,
}

export type DecoratedNames = {
  gemName: string;
}

export type Item =
  RawItem &
  NormalizedProperties &
  DecoratedNames &
  SocketProperties &
  {
    socketedItems: Item[],
  };

export interface ItemLineContent {
  name: ItemPropertNameKey,
  values: ItemPropertyTuple[],
  displayMode: number,
  type: number,
}

type ItemPropertyTuple = [
  string,
  number,
];

export enum ItemPropertNameKey {
  Level = 'Level',
  Quality = 'Quality',
}

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
};

export enum ItemType {
  NORMAL = 0,
  MAGIC = 1,
  RARE = 2,
  UNIQUE = 3,
  GEM = 4,
  CURRENCY = 5,
  DIVINATION_CARD = 6,
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

type Socket = {
  group: number,
  sColour: 'R' | 'G' | 'B' | 'W' /* White */ | 'A'  /* Abyss */
};

type Requirement = {

};
