import { getStoreBuilder, BareActionContext } from "vuex-typex";
import { RootState } from "../store"
import { MODULES } from "@/constants";
import { authenticate } from "@/api/api";
import message from '@/i18n';
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

export const session = {
  get state() { return stateGetter() },

  mutations: {
    setCharacters: builder.commit(function setCharacters(state: SessionState, chars: Character[]){
      state.characters = chars;
    }),
  },

  actions: {

  },

  getters: {
    get leagues(): () => string[] {
      return builder.read(state => [...new Set<string>(
        state.characters.map(char => char.league)
      )]);
    }
  },
}
