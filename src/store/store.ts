// path: store/store.ts (root store definition)
import { getStoreBuilder } from "vuex-typex"
import Vue from 'vue'
import Vuex, { Store } from 'vuex'
import { MODULES } from "@/constants";
import { AuthenticationState, initialAuthenticationState } from "./modules/authentication"

const loadModules = () => {
    Object.keys(modulesMapping).forEach(module => {
        getStoreBuilder<RootState>().module(module, modulesMapping[module]);
    })
}

const modulesMapping = {
    [MODULES.authentication]: initialAuthenticationState,
}



Vue.use(Vuex)
loadModules();
// getStoreBuilder<RootState>().module(MODULES.authentication, initialAuthenticationState);

const store: Store<RootState> = getStoreBuilder<RootState>().vuexStore();

export default store
export interface RootState
{
    authentication: AuthenticationState
}
