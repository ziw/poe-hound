export enum IndexerFilterType {
  name= 'name',
  typeLine= 'typeLine',
}

export enum FunctionalFilterType {
  numSockets= 'numSockets',
  shaped= 'shaped',
}

export type Filter<T> = {
  type: T,
  value: any,
  enabled?: boolean,
}

export const createFilter = <T>(type: T) => {
  return {
    type,
    value: undefined,
    enabled: true,
  } as Filter<T>;
}