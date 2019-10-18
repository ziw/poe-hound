import { promises as fs } from 'fs';
import * as path from 'path';

const toFileName = (requestUrl: string): string | undefined => {
  try{
    const url = new URL(requestUrl);
    const search = url.search.replace(/\?/g, '')
                      .replace(/=/g, '--')
                      .replace(/&/g, '#');
    const paths = url.pathname.split('/').filter(seg => seg.trim().length).join('__');
    return `${paths}-${search}.json`;
  }catch{
    return undefined;
  }
}

export default class OfflineCache {
  constructor(
    public cacheDir: string
  ){
  }

  setCacheDir(dir: string) {
    this.cacheDir = dir;
    return this;
  }

  async cache(fullRequestUrl: string, content: string) {
    const fileName = toFileName(fullRequestUrl);
    if(fileName && await this.isCacheDirValid()) {
      return fs.writeFile(path.join(this.cacheDir, fileName), content);
    }
  }

  async read(fullRequestUrl: string) {
    const fileName = toFileName(fullRequestUrl);
    if(fileName && await this.isCacheDirValid()){
      return fs.readFile(path.join(this.cacheDir, fileName), 'utf8');
    }
  }

  private isCacheDirValid() {
    if(!this.cacheDir) {
      return Promise.resolve(false);
    }
    return fs.stat(this.cacheDir)
             .then(stats => stats.isDirectory());
  }
}
