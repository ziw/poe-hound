export default interface StashPage {
  /**
   * stash page name
   */
  n: string;

  /**
   * stash index from 0
   */
  i: number;

  id: string;

  type: StashType;

  itemIds: string[];

  colour: {
    r: number,
    g: number,
    b: number,
  },
}

export enum StashType {
  CurrencyStash = 'CurrencyStash',
  MapStash = 'MapStash',
  EssenceStash = 'EssenceStash',
  QuadStash = 'QuadStash',
  DivinationCardStash = 'DivinationCardStash',
  FragmentStash = 'FragmentStash',
  NormalStash = 'NormalStash',
  PremiumStash = 'PremiumStash',
}
