import { getStoreBuilder, BareActionContext } from "vuex-typex";
import { RootState } from "../store"
import { MODULES } from "@/constants";
import { loadCharacters } from "@/api/api";
import message from '@/i18n';
import { authentication } from './authentication';
import Character from '@/models/character';

export interface SessionState {
  characters: Character[];
  currentLeague: string;
}

export const initSession: SessionState = {
  characters: [],
  currentLeague: '',
}

const builder = getStoreBuilder<RootState>().module(MODULES.session, initSession);

const stateGetter = builder.state();

const leaguesGetter = builder.read(state => [...new Set<string>(state.characters.map(char => char.league))], 'leaguesGetter',);

export const session = {
  get state() { return stateGetter() },

  mutations: {
    setCharacters: builder.commit((state: SessionState, chars: Character[]) => state.characters = chars, 'setCharacters'),

    setCurrentLeague: builder.commit((state, league: string) => state.currentLeague = league, 'setCurrentLeague'),
  },


  actions: {
    loadCharacters: builder.dispatch(async () => {
        try{
          const characters = await loadCharacters(authentication.state.sessionId);
          session.mutations.setCharacters(characters);
          if(characters.length){
            //use first league as default leauge
            session.mutations.setCurrentLeague(session.getters.leagues[0]);
          }
        }catch{
        }
      }, "loadCharacters"),
  },

  getters: {
    get leagues(): string[] { return leaguesGetter() }
  },
}
