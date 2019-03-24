import { PATHS, COOKIE_NAME } from '@/constants';
import  request, {FullResponse} from 'request-promise-native';
import Character from '@/models/character';
import StashPage from '@/models/stashPage';
import Item from '@/models/item';

const get = (url: string, sessionId: string)=> {
  return request.get({
    url,
    headers: {
      Cookie: `${COOKIE_NAME}=${sessionId}`
    },
    rejectUnauthorized: true,
    resolveWithFullResponse: true,
  }).then(resp => {
    console.log({
      resp,
      url,
    });
    return resp;
  });
}

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
          .then((resp: FullResponse) => JSON.parse(resp.body).accountName);
}

export function loadCharacters(sessionId: string) {
  return get(buildUrl(PATHS.charactersUrl), sessionId)
          .then((resp: FullResponse) => JSON.parse(resp.body) as Character[]);
}

export function loadInventory(sessionId: string, character: string, accountName: string){
  return get(buildUrl(PATHS.inventoryUrl, { character, accountName }), sessionId)
          .then((resp: FullResponse) => (JSON.parse(resp.body) as { items: Item[] }).items);
}

export function loadLeagueStashInformation(sessionId: string, league: string, accountName: string){
  const query = {
    tabs: 1,
    league,
    accountName,
  };
  return get(buildUrl(PATHS.stashInLeagueUrl, query), sessionId)
          .then((resp: FullResponse) => JSON.parse(resp.body).tabs as StashPage[]);
}
