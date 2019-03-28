import { getStoreBuilder } from "vuex-typex";
import { RootState } from "../store";
import { MODULES, Status } from "@/constants";

export interface FilterState {

}

export const initFilters: FilterState = {

}

const builder = getStoreBuilder<RootState>().module(MODULES.filters, initFilters);
