import StashPage, { StashType } from './stashPage';
import Character, { CharacterType } from './character';
import { Status } from '@/constants';

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
     * background and border color
     */
    public color: { r: number, g: number, b: number } = { r: 0, g: 0, b: 0 },
  ){

  }

  public static fromCharacter(char: Character) {
    return new Tab(
      char.name,
      CharacterType.Character,
      char.name,
    );
  }

  public static fromStashPage(stash: StashPage) {
    return new Tab(
      stash.n,
      stash.type,
      stash.i.toString(),
      stash.colour,
    );
  }

}
