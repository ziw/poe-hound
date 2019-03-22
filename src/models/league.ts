import Character from './character';
import StashPage from './stashPage';
import Tab from './tab';

export default interface League {
  characters: Tab[];
  name: string;
  stashPages: Tab[];
}
