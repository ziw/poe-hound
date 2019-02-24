import { getStoreBuilder } from "vuex-typex"
import Vue from 'vue'
import Vuex, { Store } from 'vuex'
import { MODULES } from "@/constants";
import { AuthenticationState, initialAuthenticationState } from "./modules/authentication"
import { SessionState, initSession } from './modules/session'
import { initialJobState, JobState } from './modules/job';

const loadModules = () => {
    Object.keys(modulesMapping).forEach(module => {
        getStoreBuilder<RootState>().module(module, modulesMapping[module]);
    })
}

const modulesMapping = {
    [MODULES.authentication]: initialAuthenticationState,
    [MODULES.session]: initSession,
    [MODULES.job]: initialJobState,
}

Vue.use(Vuex)
loadModules();

const store: Store<RootState> = getStoreBuilder<RootState>().vuexStore();

export default store
export interface RootState
{
    authentication: AuthenticationState,
    session: SessionState,
    job: JobState
}
