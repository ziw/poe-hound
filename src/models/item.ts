export type RawItem = {
  id: string;
  w: number;
  h: number;
  x: number;
  y: number;
  ilvl: number;
  frameType: number;
  stackSize: number;
  maxStackSize: number;

  inventoryId: InventoryId;
  identified: boolean;
  corrupted: boolean;
  elder: boolean;
  shaper: boolean;
  fractured: boolean;

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

export type Item =
  RawItem &
  NormalizedProperties &
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

type Socket = {

};

type Requirement = {

};
