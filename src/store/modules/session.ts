import { getStoreBuilder, BareActionContext } from "vuex-typex";
import { RootState } from "../store"
import { MODULES, Status } from "@/constants";
import { loadCharacters,
        loadInventory,
        loadLeagueStashInformation,
} from "@/api/api";
import message from '@/i18n';
import { authentication } from './authentication';
import { filters } from './filters';
import Character from '@/models/character';
import League from '@/models/league';
import StashPage from '@/models/stashPage';
import queue, { pushApiJob } from '@/utils/jobQueue';
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
      characters: characters.filter(c => c.league === name).map(c => Tab.fromCharacter(c)),
    };
  }));

  if(characters.length){
    //use first league as default leauge
    session.mutations.setCurrentLeagueName(session.state.leagues[0].name);
  }
}, "loadCharacters");

/**
 * Load stash tab metadata of the given league. This only loads the stash tabs name, id etc.
 * It does not load the items of each stash tab
 */
const dispatchLoadLeagueStashInfo = builder.dispatch(async (context, leagueName: string) => {
  const stashTabs = await loadLeagueStashInformation(sessionId(), leagueName, accountName());
  session.mutations.setLeagueStashTabs({ leagueName, stashTabs });
}, 'loadLeagueStashInfo');

/**
 * Load stash tab metadata for all leagues in this session
 */
const dispatchLoadAllLeagueStashInfo = builder.dispatch(async () => {
  session.state.leagues.forEach(league => {
    pushApiJob(
      () => dispatchLoadLeagueStashInfo(league.name),
      message.jobs.load_stash_metadata_message(league.name),
    );
  })
}, 'dispatchLoadAllLeagueStashInfo');

/**
 * Load items for a given character tab
 */
const dispatchLoadItems = builder.dispatch(async (context, tab: Tab) => {
  const characterName = tab.id;

  session.mutations.setTabStatus({
    tab,
    status: Status.LOADING,
  });

  try{
    const items = await pushApiJob(() => loadInventory(sessionId(), characterName, accountName()),
      `loading character ${characterName}`);
    session.mutations.setTabStatus({
      tab,
      status: Status.SUCCESS,
    });
    session.mutations.setTabItemIds({
      tab,
      itemIds: items.map(item => item.id),
    });
    ItemStore.insertAll(items);

  }catch{
    session.mutations.setTabStatus({
      tab,
      status: Status.FAILED,
    });
  }
}, 'loadInventory');

const dispatchTestJob = builder.dispatch(async () => {
  // const result = await pushApiJob(() => loadCharacters(authentication.state.sessionId), "loading characters");
  // console.log('characters loaded');
  // console.log(result);
  let id = 1;
  const callback: () => Promise<string> = () => {
    return new Promise((resolve, reject)=> {
      if(!id){
        setTimeout(() => resolve("job done"), 1000)
      }else{
        setTimeout(() => {
          id--;
          reject("job failed");
        }, 1000);
      }
    })
  };

    const { done } = queue.pushJob(callback, "print test job 1");
    done.then(result => {
      console.log(result);
    })
    .catch((error) => {
      console.log('first error');
      queue.pause(2);
      const job = queue.pushJob(callback, "print test job 2");
      job.done.then(result => {
        console.log(result);
      })
    })
}, "dispatch test job");

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
    return filteredStashTabs.filter(tab => tab.itemIds.some(id => filterResults.includes(id)));
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
        league.stashPages = payload.stashTabs.map(stash => Tab.fromStashPage(stash));
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
    dispatchTestJob,
    dispatchLogout,
  },

  getters: {
    getCurrentLeague,
    getFilteredStashTabs,
    getSelectedStashTab,
  },
}
