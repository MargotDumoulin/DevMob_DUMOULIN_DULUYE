import { createSlice } from "@reduxjs/toolkit";
import { cloneDeep } from "lodash";
import { getPokemonId } from "../../api/PokeAPIPokemon";
import AsyncStorage from "@react-native-async-storage/async-storage";

const initialState = {
    pokemonsCache: [],
    pokemonsFav: []
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
        addNewPokemon(state, action) {
            let id;

            if (!state.pokemonsCache[state.pokemonsCache.length - 1]?.id) {
                id = state.pokemonsCache.length + 1;
            }
            else {
                id = Math.max(
                    state.pokemonsCache
                        .map(pokemon => pokemon.id)
                        .filter(pokemonId => pokemonId !== undefined && pokemonId !== null)
                ) + 1;
            }

            state.pokemonsCache.push({
                id: id,
                ...action.payload,
            });
        },
        removeNewPokemon(state, action) {
            state.pokemonsCache = state.pokemonsCache.filter(pokemon => pokemon.id !== action.payload);
        },
        addPokemonFav(state, action) {
            state.pokemonsFav.push(action.payload)
        },
        removePokemonFav(state, action) {
            state.pokemonsFav = state.pokemonsFav.filter(pokemonId => pokemonId !== action.payload);
        }
    }
});

export const { addPokemonsCache, addPokemonDetails, addNewPokemon, removeNewPokemon, addPokemonFav, removePokemonFav } =
    pokemonsSlice.actions;
export default pokemonsSlice.reducer;
