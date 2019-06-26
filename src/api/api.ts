import { PATHS, COOKIE_NAME } from '@/constants';
import  request, {FullResponse} from 'request-promise-native';
import Character from '@/models/character';
import StashPage from '@/models/stashPage';
import Item from '@/models/item';
import OfflineCache from '@/utils/offlineCache';

const offlineCacher = new OfflineCache(process.env.VUE_APP_CACHE_DIR as string);

const get = (url: string, sessionId: string)=> {

  return request.get({
    url,
    headers: {
      Cookie: `${COOKIE_NAME}=${sessionId}`
    },
    rejectUnauthorized: true,
    resolveWithFullResponse: true,
  })
  .then((resp: FullResponse) => {
    if(resp.statusCode === 200){
      offlineCacher.cache(url, resp.body);
    }
    console.log({
      resp,
      url,
    });
    return resp;
  }).catch(error => {
    if(error && error.statusCode !== 429 && process.env.VUE_APP_CACHE_DIR){
      return offlineCacher.read(url).then(content => ({
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
  return get(buildUrl(PATHS.accountNameUrl), sessionId)
          .then((resp: {body: string}) => JSON.parse(resp.body).accountName);
}

export function loadCharacters(sessionId: string) {
  return get(buildUrl(PATHS.charactersUrl), sessionId)
          .then((resp: {body: string}) => JSON.parse(resp.body) as Character[]);
}

export function loadInventory(sessionId: string, character: string, accountName: string){
  return get(buildUrl(PATHS.inventoryUrl, { character, accountName }), sessionId)
          .then((resp: {body: string}) => (JSON.parse(resp.body) as { items: Item[] }).items);
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
  return get(buildUrl(PATHS.stashUrl, query), sessionId)
          .then((resp: {body: string}) => (JSON.parse(resp.body) as { items: Item[] }).items);
}

export function loadLeagueStashInformation(sessionId: string, league: string, accountName: string){
  const query = {
    tabs: 1,
    league,
    accountName,
  };
  return get(buildUrl(PATHS.stashMetadataUrl, query), sessionId)
          .then((resp: {body: string}) => JSON.parse(resp.body).tabs as StashPage[]);
}
