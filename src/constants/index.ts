export * from './modules';
export * from './paths';

export const COOKIE_NAME = 'POESESSID';

export enum Status {
  INIT = 'INIT',
  FAILED = 'FAILED',
  SUCCESS = 'SUCCESS',
  LOADING = 'LOADING',
}
