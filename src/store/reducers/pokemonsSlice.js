import { createSlice } from "@reduxjs/toolkit";
import { cloneDeep } from "lodash";
import { getPokemonId } from "../../api/PokeAPIPokemon";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as FileSystem from "expo-file-system";
import * as Permissions from "expo-permissions";
import * as MediaLibrary from "expo-media-library";

const initialState = {
    pokemonsCache: [],
    pokemonsFav: [],
};

const pokemonsSlice = createSlice({
    name: "pokemonsSlice",
    initialState: initialState,
    reducers: {
        addPokemonsCache(state, action) {
            if (state.pokemonsCache.length == 0) {
                state.pokemonsCache = action.payload;
            }
        },
        updatePokemon(state, action) {
            const pokemonToUpdate = action.payload;
            const pokemonsCacheCopy = cloneDeep(state.pokemonsCache);
            const index = pokemonsCacheCopy.findIndex((poke) => {
                return (
                    Number(poke.url ? getPokemonId(poke.url) : poke.id) ===
                    pokemonToUpdate.id
                );
            });

            pokemonsCacheCopy[index] = {
                ...pokemonsCacheCopy[index],
                ...pokemonToUpdate,
            };
            state.pokemonsCache = pokemonsCacheCopy;
        },
        addNewPokemon(state, action) {
            const id =
                Math.max(
                    ...state.pokemonsCache.map((pokemon) =>
                        Number(pokemon?.id || getPokemonId(pokemon.url))
                    )
                ) + 1;

            state.pokemonsCache.push({
                id,
                ...action.payload,
            });
        },
        removeNewPokemon(state, action) {
            state.pokemonsCache = state.pokemonsCache.filter(
                (pokemon) => pokemon.id !== action.payload
            );
        },
        exportNewPokemon(state, action) {
            const stateCopy = cloneDeep(state.pokemonsCache);

            Promise.all(
                stateCopy
                    .filter((pokemon) => pokemon?.isNew)
                    .map((pokemon) => {
                        delete pokemon.id;

                        return pokemon;
                    })
                    .map((pokemon) => {
                        if (pokemon.image.startsWith("file://")) {
                            return FileSystem.readAsStringAsync(pokemon.image, {
                                encoding: FileSystem.EncodingType.Base64,
                            })
                                .then((base64Img) => {
                                    delete pokemon.image;

                                    pokemon.image = `data:image/png;base64,${base64Img}`;
                                    return pokemon;
                                })
                                .catch((error) => {
                                    console.log({ error });
                                });
                        }

                        return Promise.resolve(pokemon);
                    })
            )
                .then((array) => {
                    Permissions.askAsync(Permissions.MEDIA_LIBRARY).then(
                        (permissions) => {
                            if (permissions.status === "granted") {
                                const fileUri =
                                    FileSystem.documentDirectory +
                                    "export.json";

                                FileSystem.writeAsStringAsync(
                                    fileUri,
                                    JSON.stringify(array),
                                    { encoding: FileSystem.EncodingType.UTF8 }
                                ).then(() => {
                                    MediaLibrary.saveToLibraryAsync(fileUri);
                                });
                            }
                        }
                    );
                })
                .catch((err) => {
                    console.error({ err });
                });
        },
        addPokemonFav(state, action) {
            state.pokemonsFav.push(action.payload);
        },
        removePokemonFav(state, action) {
            state.pokemonsFav = state.pokemonsFav.filter(
                (pokemonId) => pokemonId !== action.payload
            );
        },
    },
});

export const {
    addPokemonsCache,
    updatePokemon,
    addNewPokemon,
    removeNewPokemon,
    exportNewPokemon,
    addPokemonFav,
    removePokemonFav,
} = pokemonsSlice.actions;
export default pokemonsSlice.reducer;
