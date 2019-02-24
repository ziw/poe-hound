import { getStoreBuilder, BareActionContext } from "vuex-typex";
import { RootState } from "../store"
import { MODULES } from "@/constants";
import { loadCharacters,
        loadInventory,
        loadLeagueStashInformation,
} from "@/api/api";
import message from '@/i18n';
import { authentication } from './authentication';
import Character from '@/models/character';
import League from '@/models/league';
import StashPage from '@/models/stashPage';
import queue from '@/utils/jobQueue';

export interface SessionState {
  characters: Character[];
  currentLeagueName: string;
  leagues: League[];
}

export const initSession: SessionState = {
  characters: [],
  currentLeagueName: '',
  leagues: [],
}

const builder = getStoreBuilder<RootState>().module(MODULES.session, initSession);

const stateGetter = builder.state();

/**
 * Load all characters under account. Populate league list based on characters.
 */
const dispatchLoadCharacters = builder.dispatch(async () => {
  const characters = await loadCharacters(authentication.state.sessionId);
  session.mutations.setCharacters(characters);
  session.mutations.setLeagues([...new Set<string>(characters.map(c => c.league))].map(name => {
    return {
      name,
      stashPages: [],
      characters: characters.filter(c => c.league === name).map(c => {
        c.itemIds = [];
        return c;
      }),
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
const dispatchLoadLeagueStashInfo = builder.dispatch(async (context, league: string) => {
  const stashTabs = await loadLeagueStashInformation(authentication.state.sessionId,
    league, authentication.state.accountName);
  session.mutations.setLeagueStashTabs({
    league,
    stashTabs: stashTabs.map(stash => {
      stash.itemIds = [];
      return stash;
    }),
  });
}, 'loadLeagueStashInfo');

/**
 * Load stash tab metadata for all leagues in this session
 */
const dispatchLoadAllLeagueStashInfo = builder.dispatch(async () => {
  session.state.leagues.forEach(league => {
    dispatchLoadLeagueStashInfo(league.name);
  })
}, 'dispatchLoadAllLeagueStashInfo');

export const session = {
  get state() { return stateGetter() },

  mutations: {
    setCharacters: builder.commit((state: SessionState, chars: Character[]) => state.characters = chars, 'setCharacters'),

    setLeagues: builder.commit((state, leagues: League[]) => state.leagues = leagues, 'setLeagues'),

    setCurrentLeagueName: builder.commit((state, league: string) => state.currentLeagueName = league, 'setCurrentLeagueName'),

    setLeagueStashTabs: builder.commit((state, payload: { league: string, stashTabs: StashPage[] }) => {
      const league = state.leagues.find(league => league.name === payload.league);
      if(league){
        league.stashPages = payload.stashTabs;
      }
    }, 'setLeagueStashTabs'),
  },


  actions: {
    loadCharacters: dispatchLoadCharacters,
    loadLeagueStashInfo: dispatchLoadLeagueStashInfo,
    loadAllLeagueStashInfo: dispatchLoadAllLeagueStashInfo,
  },

  getters: {

  },
}
