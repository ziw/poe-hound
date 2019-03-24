export default interface Character{
  name: string;
  league: string;
  classId: number;
  ascendancyClass: number;
  class: string;
  level: number;
  experience: number;
  itemIds: string[];
}

export enum CharacterType {
  Character= 'Character',
};
