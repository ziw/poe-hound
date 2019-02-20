import { PATHS, COOKIE_NAME } from '@/constants';
import { client } from './client';
import  request, {FullResponse} from 'request-promise-native';

const get = (url: string, sessionId: string)=> {
  return request.get({
    url,
    headers: {
      Cookie: `${COOKIE_NAME}=${sessionId}`
    },
    rejectUnauthorized: true,
    resolveWithFullResponse: true,
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

export function authenticate(sessionId: string): Promise<boolean> {
  return get(buildUrl(PATHS.charactersUrl), sessionId)
          .then((resp: FullResponse) => resp.statusCode === 200);
}
