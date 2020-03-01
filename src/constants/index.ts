export * from './modules';
export * from './paths';

export const COOKIE_NAME = 'POESESSID';
export const BASE_DIMENSION = 600;
export const RECOVERY_FLASKS = ['Hybrid Flask', 'Mana Flask', 'Life Flask'];
export const OPTION_ANY = 'Any';

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