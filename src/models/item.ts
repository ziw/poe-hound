export default interface Item {
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

  properties: object[];


  socketedItems: Item[];
  sockets: Socket[];
  requirements: Requirement[];
};

export enum InventoryId {

};

export interface Socket {

};

export interface Requirement {

};
