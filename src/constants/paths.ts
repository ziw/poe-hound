export const PATHS = {
  baseUrl: 'https://www.pathofexile.com',
  loginUrl: 'login/',
  charactersUrl: '/character-window/get-characters/',
  accountNameUrl: '/character-window/get-account-name/',

  //query ?character={0}&accountName={1}
  inventoryUrl: '/character-window/get-items',

  //query ?league={0}&tabs=0&tabIndex={1}&accountName={2}
  stashUrl: '/character-window/get-stash-items',

   //query ?league={0}&tabs=1&accountName={1}
  stashMetadataUrl: '/character-window/get-stash-items',

  //query ?accountName={0}&realm=pc&character={1}
  passiveTreeUrl: '/character-window/get-passive-skills',
}
