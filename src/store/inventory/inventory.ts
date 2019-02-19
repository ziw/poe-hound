
import { getStoreBuilder } from "vuex-typex"
import { RootState } from "../store"

export interface InventoryState { productsById: { [productId: string]: Product } }
export interface Product { id: string, name: string }

export const initialInventoryState: InventoryState = {
    productsById: {
        "fritos": { id: "fritos", name: "Fritos Corn Chips, Chili Cheese" },
        "doritos": { id: "doritos", name: "Doritos Nacho Cheese Flavored Tortilla Chips" },
        "cheetos": { id: "cheetos", name: "Cheetos Crunchy Cheese Flavored Snacks" },
        "tostitos": { id: "tostitos", name: "Tostitos Original Restaurant Style Tortilla Chips" }
    }
}
const p = getStoreBuilder<RootState>().module("inventory", initialInventoryState)
const getProductByIdGetter = p.read(state => (id: string) => state.productsById[id], "getProductById")

// state
const stateGetter = p.state()

// exported "inventory" module interface
const inventory = {
    // state
    get state() { return p.state()() },

    // getter as method
    getProductById(id: string)
    {
        return getProductByIdGetter()(id)
    }
}
export default inventory