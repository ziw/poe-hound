import { getStoreBuilder } from "vuex-typex";
import { RootState } from "../store"
import { MODULES, Status } from "@/constants";
import { loadCharacters,
        loadInventory,
        loadLeagueStashInformation,
        loadStash,
} from "@/api/api";
import message from '@/i18n';
import { authentication } from './authentication';
import { filters } from './filters';
import Character, { CharacterType } from '@/models/character';
import League from '@/models/league';
import StashPage from '@/models/stashPage';
import { pushApiJob } from '@/utils/jobQueue';
import Tab from '@/models/tab';
import ItemStore from '@/indexer/itemStore';

export interface SessionState {
  characters: Character[];
  currentLeagueName: string;
  leagues: League[];
  selectedTabId: string;
}

export const initSession: SessionState = {
  characters: [],
  currentLeagueName: '',
  leagues: [],
  selectedTabId: '',
}

const builder = getStoreBuilder<RootState>().module(MODULES.session, initSession);

const stateGetter = builder.state();

const sessionId = () => authentication.state.sessionId;
const accountName = () => authentication.state.accountName;

/************
 * Actions *
 ************/
/**
 * Load all characters under account. Populate league list based on characters.
 */
const dispatchLoadCharacters = builder.dispatch(async () => {
  const characters = await pushApiJob(
    () => loadCharacters(sessionId()),
    message.jobs.load_all_characters_message,
  );
  session.mutations.setCharacters(characters);
  session.mutations.setLeagues([...new Set<string>(characters.map(c => c.league))].map(name => {
    return {
      name,
      stashPages: [],
      characters: characters.filter(c => c.league === name).map(c => Tab.fromCharacter(c, name)),
    };
  }));
}, "loadCharacters");

/**
 * Load stash tab metadata of the given league. This only loads the stash tabs name, id etc.
 * It does not load the items of each stash tab
 */
const dispatchLoadLeagueStashInfo = builder.dispatch(async (context, leagueName: string) => {
  const stashTabs = await pushApiJob(
    () => loadLeagueStashInformation(sessionId(), leagueName, accountName()),
    message.jobs.load_stash_metadata_message(leagueName)
  );
  session.mutations.setLeagueStashTabs({ leagueName, stashTabs });
}, 'loadLeagueStashInfo');

/**
 * Load stash tab metadata for all leagues in this session
 */
const dispatchLoadAllLeagueStashInfo = builder.dispatch(async () => {
  session.state.leagues.forEach(league => {
    dispatchLoadLeagueStashInfo(league.name);
  });

}, 'dispatchLoadAllLeagueStashInfo');

const loadAllCharInventoriesFromLeague = builder.dispatch(async (context, leagueName: string) => {
  const league = getLeagueByName()(leagueName)!;
  league.characters.forEach(character => dispatchLoadItems(character));
}, 'loadAllCharInventoriesFromLeague');

const loadAllStashItemsFromLeague = builder.dispatch(async (context, leagueName: string) => {
  const league = getLeagueByName()(leagueName)!;
  league.stashPages.forEach(stash => {
    dispatchLoadItems(stash);
  });
}, 'loadAllStashItemsFromLeague');

/**
 * Load items for a given character tab or stash tab
 */
const dispatchLoadItems = builder.dispatch(async (context, tab: Tab) => {
  if(tab.status === Status.LOADING || tab.status === Status.SUCCESS) {
    return;
  }
  const { id, name } = tab;

  session.mutations.setTabStatus({
    tab,
    status: Status.LOADING,
  });

  try{
    const items = tab.type === CharacterType.Character ?
      await pushApiJob(() => loadInventory(sessionId(), id, accountName()), `loading character ${id}`)
        : await pushApiJob(() => loadStash(sessionId(), id, accountName(), tab.league), `loading stash page ${name}`);
    const allItems = items.concat(items.flatMap(item => item.socketedItems || []));
    session.mutations.setTabStatus({
      tab,
      status: Status.SUCCESS,
    });
    session.mutations.setTabItemIds({
      tab,
      itemIds: allItems.map(item => item.id),
    });
    ItemStore.insertAll(allItems);

  }catch(error){
    console.log(error);
    session.mutations.setTabStatus({
      tab,
      status: Status.FAILED,
    });
  }
}, 'loadInventory');

const dispatchLogout = builder.dispatch(async () => {

}, 'dispatchLogout');


/************
 * Getters *
 ************/
const getLeagueByName = builder.read(state =>
  (leagueName: string) => state.leagues.find(league => league.name === leagueName),
'getLeagueByName');

const getCurrentLeague = builder.read(state => getLeagueByName()(state.currentLeagueName), 'getCurrentLeague');

const getFilteredStashTabs = builder.read(() => {

  const league = getCurrentLeague();
  if(!league) {
    return [];
  }
  const filteredStashTabs = [...league.characters, ...league.stashPages];
  const filterResults = filters.state.filterResults;
  if(filters.state.filterActive) {
    return filteredStashTabs.filter(tab => tab.itemIds.some(id => filterResults.has(id)));
  }
  return filteredStashTabs;
}, 'getFilteredStashTabs');

const getSelectedStashTab = builder.read(state => {
  const filteredTabs = getFilteredStashTabs();
  if(!filteredTabs.length) {
    return undefined;
  }

  let selectedTab = filteredTabs.find(tab => tab.id === stateGetter().selectedTabId);

  if(!selectedTab) {
    session.mutations.setSelectedTabId(filteredTabs[0].id);
    selectedTab = filteredTabs[0];
  }
  return selectedTab;

}, 'getSelectedStashTab');

/**
 * export Session module object
 */
export const session = {
  get state() { return stateGetter() },

  mutations: {

    setCharacters: builder.commit((state: SessionState, chars: Character[]) => state.characters = chars, 'setCharacters'),

    setLeagues: builder.commit((state, leagues: League[]) => state.leagues = leagues, 'setLeagues'),

    setCurrentLeagueName: builder.commit((state, league: string) => state.currentLeagueName = league, 'setCurrentLeagueName'),

    setLeagueStashTabs: builder.commit((state, payload: { leagueName: string, stashTabs: StashPage[] }) => {
      const league = getLeagueByName()(payload.leagueName);
      if(league){
        league.stashPages = payload.stashTabs.map(stash => Tab.fromStashPage(stash, payload.leagueName));
      }
    }, 'setLeagueStashTabs'),

    setSelectedTabId: builder.commit((state, id: string) => state.selectedTabId = id, 'setSelectedTabId'),

    setTabStatus: builder.commit((state, payload: { tab: Tab, status: Status }) => {
      payload.tab.status = payload.status;
    }, 'setTabStatus'),

    setTabItemIds: builder.commit((state, payload: { tab: Tab, itemIds: string[] }) => {
      payload.tab.itemIds = payload.itemIds;
    }, 'setTabItems'),

  },


  actions: {
    dispatchLoadCharacters,
    dispatchLoadLeagueStashInfo,
    dispatchLoadAllLeagueStashInfo,
    dispatchLoadItems,
    dispatchLogout,
    loadAllStashItemsFromLeague,
    loadAllCharInventoriesFromLeague,
  },

  getters: {
    getCurrentLeague,
    getFilteredStashTabs,
    getSelectedStashTab,
  },
}
