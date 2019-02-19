// path: store/store.ts (root store definition)
import { getStoreBuilder } from "vuex-typex"
import Vue from 'vue'
import Vuex, { Store } from 'vuex'
import { InventoryState, initialInventoryState } from "./inventory/inventory"
import { BasketState, initialBasketState } from "./basket/basket"

export interface RootState
{
    inventory: InventoryState;
    basket: BasketState;
}

Vue.use(Vuex)

getStoreBuilder<RootState>().module("basket", initialBasketState);
getStoreBuilder<RootState>().module("inventory", initialInventoryState);

const store: Store<RootState> = getStoreBuilder<RootState>().vuexStore();
export default store // <-- "store" to provide to root Vue