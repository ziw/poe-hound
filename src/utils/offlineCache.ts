import { promises as fs } from 'fs';
import * as path from 'path';

const toFileName = (requestUrl: string, form ?: {[k:string]: any}): string | undefined => {
  try{
    const url = new URL(requestUrl);
    const queryParams = form ? Object.keys(form).map(key => key + '=' + form[key]).join('&') : url.search;
    const search = queryParams.replace(/\?/g, '')
                      .replace(/=/g, '--')
                      .replace(/&/g, '#');
    const paths = url.pathname.split('/').filter(seg => seg.trim().length).join('__');
    return `${paths}-${search}.json`;
  }catch{
    return undefined;
  }
}

export default class OfflineCache {

  private cacheDir: string = '';

  setCacheDir(dir: string) {
    this.cacheDir = dir;
    return this;
  }

  async cache(fullRequestUrl: string, content: string, form ?:{[k:string]: any}) {
    const fileName = toFileName(fullRequestUrl, form);
    if(fileName && await this.isCacheDirValid()) {
      return fs.writeFile(path.join(this.cacheDir, fileName), content);
    }
  }

  async read(fullRequestUrl: string, form ?:{[k:string]: any}) {
    const fileName = toFileName(fullRequestUrl, form);
    if(fileName && await this.isCacheDirValid()){
      return fs.readFile(path.join(this.cacheDir, fileName), 'utf8');
    }
    return '';
  }

  private isCacheDirValid() {
    if(!this.cacheDir) {
      return Promise.resolve(false);
    }
    return fs.stat(this.cacheDir)
             .then(stats => stats.isDirectory());
  }
}
