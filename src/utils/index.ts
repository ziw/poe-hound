import { FilterBooleanOptions, ValueRange } from '@/constants';
import Item from '@/models/item';

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

  ofMaxValue: (getPropValue: (some: Item) => number) =>
                (item: Item, value: number) => value >= getPropValue(item),
  ofMinValue: (getPropValue: (some: Item) => number) =>
                (item: Item, value: number) => value <= getPropValue(item),
  ofRange: (getPropValue: (some: Item) => number) =>
              (item: Item, value: ValueRange) => value.min <= getPropValue(item) && value.max >= getPropValue(item),
}
