import {createSlice} from "@reduxjs/toolkit";
import {getAllPokemon} from "../../apis/PokeAPIPokemon";

const pokemon = {
    pokemonList: [],
}
export const pokemonReducer = createSlice({
    name: 'pokemon',
    initialState: pokemon,
    reducers: {
        loadPokemonCache: (state, action) => {
            state.pokemonList = getAllPokemon();
        }
    }
});

export const {loadPokemonCache} = pokemonReducer.actions