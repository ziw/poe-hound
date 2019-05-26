/**
 * Filter and return an array after removing duplicate value
 * @param arr the array to filter
 */
export const unique = <T>(arr: T[]) => {
  return Array.from(new Set(arr));
}