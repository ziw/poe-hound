import { PATHS, COOKIE_NAME } from '@/constants';
import  request, { FullResponse } from 'request-promise-native';
import Character from '@/models/character';
import StashPage from '@/models/stashPage';
import { RawItem } from '@/models/item';
import OfflineCache from '@/utils/offlineCache';
import { decorateItem } from '@/utils/itemUtil';
import { authentication } from '@/store/modules/authentication';

const offlineCacher = new OfflineCache();

const fetch = (url: string, sessionId: string, method = 'GET', form ?:object): Promise<string> => {
  offlineCacher.setCacheDir(authentication.state.accountCacheDir);
  const offlineMode = authentication.state.offlineMode;
  if(offlineMode) {
    return offlineCacher.read(url, form);
  }
  return request({
    url,
    form,
    method,
    headers: {
      Cookie: `${COOKIE_NAME}=${sessionId}`
    },
    rejectUnauthorized: true,
    resolveWithFullResponse: true,
  })
  .then((resp: FullResponse) => {
    if(resp.statusCode === 200){
      offlineCacher.cache(url, resp.body, form);
    }
    return resp.body;
  }).catch(error => {
    if(error && error.statusCode !== 429){
      return offlineCacher.read(url, form).then(content => ({
        body: content!
      }));
    }
    throw error;
  });
};

const buildUrl = (path: string, queryObject?: any) => {
  const url = new URL(PATHS.baseUrl + path);
  if(queryObject){
    Object.keys(queryObject).forEach(key => {
      url.searchParams.append(key, queryObject[key]);
    })
  }
  return url.toString();
}

export function authenticate(sessionId: string): Promise<string> {
  return fetch(buildUrl(PATHS.accountNameUrl), sessionId)
          .then((resp) => JSON.parse(resp).accountName);
}

export function loadCharacters(sessionId: string) {
  return fetch(buildUrl(PATHS.charactersUrl), sessionId)
          .then((resp) => JSON.parse(resp) as Character[]);
}

export function loadInventory(sessionId: string, character: string, accountName: string){
  return fetch(buildUrl(PATHS.inventoryUrl), sessionId, 'POST', { character, accountName })
          .then((resp) => (JSON.parse(resp) as { items: RawItem[] }).items.map(decorateItem));
}

export function loadPassiveSkills(sessionId: string, character: string, accountName: string){
  return fetch(buildUrl(PATHS.passiveTreeUrl, { character, accountName }), sessionId)
          .then(resp => (JSON.parse(resp) as { items: RawItem[] }).items.map(decorateItem));
}

export function loadStash(sessionId: string, tabIndex: string, accountName: string, league: string,) {
  const query = {
    league,
    tabIndex,
    accountName,
    tabs: 0,
    realm: 'pc',
    public: false,
  }
  return fetch(buildUrl(PATHS.stashUrl, query), sessionId)
          .then((resp) => (JSON.parse(resp) as { items: RawItem[] }).items.map(decorateItem));
}

export function loadLeagueStashInformation(sessionId: string, league: string, accountName: string){
  const query = {
    tabs: 1,
    league,
    accountName,
  };
  return fetch(buildUrl(PATHS.stashMetadataUrl, query), sessionId)
          .then((resp) => JSON.parse(resp).tabs as StashPage[]);
}
