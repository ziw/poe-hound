import { FilterBooleanOptions } from '@/constants';

/**
 * Filter and return an array after removing duplicate values
 * @param arr the array to filter
 */
export const unique = <T>(arr: T[]) => {
  return Array.from(new Set(arr));
}

export const booleanValueOf = (option: FilterBooleanOptions) => {
  switch(option){
    case FilterBooleanOptions.YES: return true;
    case FilterBooleanOptions.NO: return false;
    default: return undefined;
  }
}

/**
 * Given two sets, return a new set with elements that are in both sets
 * @param setA Set A
 * @param setB Set B
 */
export const intersection = <T>(setA: Set<T>, setB: Set<T>) => {
  return new Set([...setA].filter(item => setB.has(item)));
}
