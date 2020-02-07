import { FilterBooleanOptions, ValueRange } from '@/constants';
import { Item } from '@/models/item';
import { filters } from '@/store/modules/filters';
import { category, groupedCategory } from '@/itemBase.json';

export type ItemCategory = keyof typeof category;
export type GroupedItemCategory = keyof typeof groupedCategory;

/**
 * Filter and return an array after removing duplicate values
 * @param arr the array to filter
 */
export const unique = <T>(arr: T[]) => {
  return Array.from(new Set(arr));
}

/**
 * Given two sets, return a new set with elements that are in both sets
 * @param setA Set A
 * @param setB Set B
 */
export const intersection = <T>(setA: Set<T>, setB: Set<T>) => {
  return new Set([...setA].filter(item => setB.has(item)));
}

const booleanValueOf = (option: FilterBooleanOptions) => {
  switch(option){
    case FilterBooleanOptions.YES: return true;
    case FilterBooleanOptions.NO: return false;
    default: return undefined;
  }
}

export const createFunctionFilter = {

  ofBooleanValue: (getPropValue: (some: Item) => boolean) => {
    return (item: Item, value: FilterBooleanOptions) => {
      const bolValue = booleanValueOf(value);
      const propValue = getPropValue(item);
      return bolValue === undefined
              || bolValue === null
              || (bolValue && propValue)
              || (!bolValue && !propValue);
    };
  },

  ofMaxValue: (getPropValue: (some: Item) => number | undefined) => (item: Item, value: number) => {
                  const propValue = getPropValue(item);
                  return propValue == undefined ? false : value >= propValue;
              },

  ofMinValue: (getPropValue: (some: Item) => number | undefined) => (item: Item, value: number) => {
                  const propValue = getPropValue(item);
                  return propValue == undefined ? false : value <= propValue;
              },
}

/**
 * checks whether the given item is in the current filter results
 * @param item the item to check
 */
export const itemInFilterResults = (item: Item) => {
  const filterResults = filters.state.filterResults;
  const highlighted = filterResults.has(item.id) || (item.socketedItems || []).some(gem => filterResults.has(gem.id));
  return highlighted;
}

export const matchItemCategory = (item: Item, value: any): boolean => {
  if(category[value as ItemCategory]) {
    //match item base type
    return (category[value as ItemCategory]).some(base => item.parsedTypeLine.includes(base));
  }else if(groupedCategory[value as GroupedItemCategory]) {
    //match grouped base type. i.e. Any One Handed Weapon
    return (groupedCategory[value as GroupedItemCategory]).some(itemCategory => matchItemCategory(item, itemCategory));
  }
  return false;
}
