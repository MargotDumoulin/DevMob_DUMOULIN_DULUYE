import { createSlice } from "@reduxjs/toolkit";
import { cloneDeep } from "lodash";
import { getPokemonId } from "../../api/PokeAPIPokemon";
import AsyncStorage from "@react-native-async-storage/async-storage";

const initialState = {
    pokemonsCache: [],
};

const pokemonsSlice = createSlice({
    name: "pokemonsSlice",
    initialState: initialState,
    reducers: {
        addPokemonsCache(state, action) {
            AsyncStorage.clear();
            if (state.pokemonsCache.length == 0) {
                state.pokemonsCache = action.payload;
            }
        },
        addPokemonDetails(state, action) {
            const pokemonToUpdate = action.payload;
            const pokemonsCacheCopy = cloneDeep(state.pokemonsCache);
            const index = pokemonsCacheCopy.findIndex((poke) => {
                return Number(getPokemonId(poke.url)) === pokemonToUpdate.id;
            });

            pokemonsCacheCopy[index] = {
                ...pokemonsCacheCopy[index],
                ...pokemonToUpdate,
            };
            state.pokemonsCache = pokemonsCacheCopy;
        },
    },
});

export const { addPokemonsCache, addPokemonDetails } = pokemonsSlice.actions;
export default pokemonsSlice.reducer;
