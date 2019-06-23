export * from './modules';
export * from './paths';

export const COOKIE_NAME = 'POESESSID';
export const BASE_DIMENSION = 600;

export enum Status {
  INIT = 'INIT',
  FAILED = 'FAILED',
  SUCCESS = 'SUCCESS',
  LOADING = 'LOADING',
}

export enum FilterBooleanOptions {
  ANY = 'ANY',
  YES = 'YES',
  NO = 'NO',
}
