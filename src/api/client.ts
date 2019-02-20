import { PATHS, COOKIE_NAME } from '@/constants';
import * as https from 'https';
import * as http from 'http';

export type Response = {
  statusCode: number,
  body: string,
}

const makeApiCall = (path: string, sessionId: string, method:string = 'GET'): Promise<Response> => {
  const options = {
    host: PATHS.baseUrl,
    path,
    port: 443,
    method,
    headers: {
      cookie: `${COOKIE_NAME}=${sessionId}`
    }
  };
  return new Promise((resolve, reject) => {
    let data = '';
    const req = https.request(options, function(res: http.IncomingMessage) {
      res.setEncoding('utf8');

      const status = res.statusCode;

      res.on('data', function (chunk) {
        data += chunk;
      });

      res.on('end', () => {
        if(status && (status >= 200 && status < 300) ) {
          resolve({
            body: data,
            statusCode: status,
          });
        }else{
          reject({
            body: data,
            statusCode: status,
          })
        }
      });

      res.on('error', () => {
        reject({
          statusCode: status,
          body: 'Error',
        });
      });
    });
    req.end();
  })
}

export const client = {
  get: (path: string, sessionId: string) => makeApiCall(path, sessionId),
}
