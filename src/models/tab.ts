import StashPage, { StashType } from './stashPage';
import Character, { CharacterType } from './character';
import { Status } from '@/constants';
import ItemStore from '@/indexer/itemStore';
import { Item } from '@/models/item';

/**
 * Represents one renderable stash tab.
 * Can be backed by either a stashPage or a character
 */
export default class Tab {
  public status: Status = Status.INIT;
  public itemIds: string[] = [];

  private constructor(
    /**
     * tab display name
     */
    public name: string,

    /**
     * tab type
     */
    public type: StashType | CharacterType,

    /**
     * either stash index or character name.
     * Used to construct request url
     */
    public id: string,

    /**
     * the league of this stash/character
     */
    public league: string,

    /**
     * background and border color
     */
    public color: { r: number; g: number; b: number } = {
      r: 255,
      g: 255,
      b: 255,
    },
  ) {}

  public static fromCharacter(char: Character, league: string) {
    return new Tab(char.name, CharacterType.Character, char.name, league);
  }

  public static fromStashPage(stash: StashPage, league: string) {
    return new Tab(stash.n, stash.type, stash.i.toString(), league, stash.colour);
  }

  /**
   * returns an array of rendered items, aka items except socketed gems
   */
  get renderedItems(): Item[] {
    return this.itemIds
      .map((id) => ItemStore.getItemFromId(id))
      .filter((item) => item && item.inventoryId) as Item[];
  }
}
