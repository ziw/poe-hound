import Character from './character';
import StashPage from './stashPage';

export default interface League {
  characters: Character[];
  name: string;
  stashPages: StashPage[];
}
