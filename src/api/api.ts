import { PATHS, COOKIE_NAME } from '@/constants';
import  request, {FullResponse} from 'request-promise-native';

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
  })
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
  return get(buildUrl(PATHS.charactersUrl), sessionId);
}
