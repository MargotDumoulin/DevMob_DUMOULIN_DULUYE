import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    pokemonsCache: [],
};

const pokemonsSlice = createSlice({
    name: "pokemonsSlice",
    initialState: initialState,
    reducers: {
        addPokemons(state, action) {
            state.pokemonsCache = [...state.pokemonsCache, ...action.payload];
        },
    },
});

export const { addPokemons } = pokemonsSlice.actions;
export default pokemonsSlice.reducer;
