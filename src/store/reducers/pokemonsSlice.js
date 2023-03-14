import { createSlice } from "@reduxjs/toolkit";
import { cloneDeep } from "lodash";
import { getPokemonId } from "../../api/PokeAPIPokemon";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as FileSystem from "expo-file-system";
import * as Permissions from "expo-permissions";

const initialState = {
    pokemonsCache: [],
    pokemonsFav: [],
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
            console.log("Export");

            console.log({
                newPokemons: state.pokemonsCache.filter(
                    (pokemon) => pokemon?.isNew
                ),
            });

            const stateCopy = cloneDeep(state.pokemonsCache);

            console.log("On commence");
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

                                    // console.log({ base64Img });

                                    pokemon.image = `data:image/png;base64,${base64Img}`;
                                    console.log("fini pour une image");
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
                    console.log("On termine");

                    Permissions.askAsync(Permissions.MEDIA_LIBRARY).then(permissions => {
                        if (permissions.status === "granted") {
                            let fileUri = FileSystem.documentDirectory + "export.json";

                            console.log({fileUri: fileUri});

                            FileSystem.writeAsStringAsync(fileUri, JSON.stringify(array), {encoding: FileSystem.EncodingType.UTF8}).then(() => {
                            });
                        }
                    });
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
