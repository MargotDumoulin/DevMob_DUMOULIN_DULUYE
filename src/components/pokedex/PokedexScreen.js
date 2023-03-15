import { useEffect, useState } from "react";
import {
    View,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    FlatList,
    Image,
    Text,
    Switch,
} from "react-native";
import {
    getPokemonId,
    getPokemonById,
    getAllPokemons,
} from "../../api/PokeAPIPokemon";
import Colors from "../../definitions/Colors";
import DisplayError from "../DisplayError";
import PokemonListItem from "./PokemonListItem";
import { useDispatch, useSelector } from "react-redux";
import {
    addNewPokemon,
    addPokemonsCache,
    exportNewPokemon,
    updatePokemon,
} from "../../store/reducers/pokemonsSlice";
import PokemonTileItem from "./PokemonTileItem";
import { FlatGrid } from "react-native-super-grid";
import Assets from "../../definitions/Assets";
import ModalSelector from "react-native-modal-selector-searchable";
import * as FileSystem from "expo-file-system";
import * as DocumentPicker from "expo-document-picker";

const limit = 20;
const filters = [
    { key: "1", value: "New" },
    { key: "2", value: "Original" },
    { key: "3", value: "Favorites" },
    { key: "4", value: "All" },
];

export const PokedexScreen = ({ navigation, route }) => {
    const [filter, setFilter] = useState(filters[3]);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [results, setResults] = useState([]);
    const [isMorePages, setIsMorePages] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [isError, setIsError] = useState(false);
    const [isMounted, setIsMounted] = useState(false);
    const [isTiles, setIsTiles] = useState(false);

    const pokemonsCached = useSelector((state) => state.pokemons.pokemonsCache);
    const idsOfFavedPokemons = useSelector(
        (state) => state.pokemons.pokemonsFav
    );
    const dispatch = useDispatch();
    const toggleSwitch = () => setIsTiles((previousState) => !previousState);
    const newSearchPokemon = () => {};

    useEffect(() => {
        cachePokemons();
    }, []);

    useEffect(() => {
        if (route?.params?.refreshResults) {
            searchPokemons([], 1);
            navigation.setParams({
                refreshResults: false,
            });
        }
    }, [route?.params?.refreshResults]);

    useEffect(() => {
        // Once cache is setup, we can initiate the search
        if (pokemonsCached.length > 0 && !isMounted) {
            searchPokemons([], 1);
            setIsMounted(true);
        }
    }, [pokemonsCached]);

    const cachePokemons = async () => {
        // Setup cache
        const res = await getAllPokemons();
        dispatch(addPokemonsCache(res.results));
    };

    const getFilterByDropdownCondition = (pokemon) => {
        switch (filter.key) {
            case filters[0].key:
                return pokemon.isNew;
            case filters[1].key:
                return !pokemon.isNew;
            case filters[2].key:
                return idsOfFavedPokemons.includes(
                    pokemon.id || getPokemonId(pokemon.url)
                );
            case filters[3].key:
                return true;
            default:
                return true;
        }
    };

    const searchPokemons = async (currentPokemons, pageToRequest) => {
        setIsRefreshing(true);
        setIsError(false);

        try {
            const pokemonsSearched = searchTerm
                ? pokemonsCached.filter(
                      (pokemon) =>
                          pokemon.name
                              .toLowerCase()
                              .startsWith(searchTerm.toLowerCase()) &&
                          getFilterByDropdownCondition(pokemon)
                  )
                : pokemonsCached.filter((pokemon) =>
                      getFilterByDropdownCondition(pokemon)
                  );

            const offset = (pageToRequest - 1) * limit;
            const pokemonsToAdd = [];

            // Go through pokemons cache and get details for each pokemon needed
            for (let index = offset; index < limit * pageToRequest; index++) {
                const pokemon = pokemonsSearched[index];
                let pokeDetails = undefined;
                if (pokemon) {
                    if (!pokemon.id) {
                        // If the pokemon has an id, it means it's already loaded!
                        pokeDetails = await getPokemonById(
                            getPokemonId(pokemon.url)
                        );
                        dispatch(updatePokemon(pokeDetails));
                    }
                    pokemonsToAdd.push(
                        pokeDetails ? { ...pokeDetails, ...pokemon } : pokemon
                    );
                }
            }

            setResults([...currentPokemons, ...pokemonsToAdd]);
            setCurrentPage(pageToRequest);
            pageToRequest === pokemonsCached.length / limit
                ? setIsMorePages(false)
                : setIsMorePages(true);
        } catch (error) {
            console.error({ error });
            setIsError(true);
            setIsMorePages(true);
            setCurrentPage(1);
        }

        setIsRefreshing(false);
    };

    const navigatePokemonDetails = (pokemonID) => {
        navigation.navigate("ViewPokemon", { pokemonID });
    };

    const newSearchPokemons = () => {
        //Keyboard.dismiss();
        searchPokemons([], 1);
    };

    const loadMorePokemons = () => {
        if (isMorePages) {
            searchPokemons(results, currentPage + 1);
        }
    };

    const exportCustomPokemon = () => {
        dispatch(exportNewPokemon());
    };
    const importCustomPokemon = () => {
        DocumentPicker.getDocumentAsync().then((file) => {
            FileSystem.readAsStringAsync(file.uri).then((content) => {
                content = JSON.parse(content);

                content.forEach((pokemon) => {
                    dispatch(addNewPokemon(pokemon));
                });
            });
        });
    };

    return (
        <View style={styles.container}>
            <View style={styles.searchContainer}>
                <TouchableOpacity onPress={newSearchPokemons}>
                    <Image
                        source={Assets.icons.search}
                        style={styles.iconSearch}
                    />
                </TouchableOpacity>
                <TextInput
                    placeholder="Pokémon à chercher"
                    style={styles.inputSearchTerm}
                    onChangeText={(text) => setSearchTerm(text)}
                    onSubmitEditing={newSearchPokemon}
                />
                <ModalSelector
                    data={filters}
                    keyExtractor={(item) => item.key}
                    labelExtractor={(item) => item.value}
                    onChange={(newFilter) => {
                        setFilter(newFilter);
                    }}
                    search={false}
                    style={styles.filterSelector}
                >
                    <TextInput
                        editable={false}
                        placeholder={"Bonjour"}
                        value={filter.value}
                        style={styles.inputSelector}
                    />
                </ModalSelector>
            </View>
            <View style={styles.containerControls}>
                <View style={styles.containerImportExport}>
                    <TouchableOpacity onPress={exportCustomPokemon}>
                        <Image
                            source={Assets.icons.export}
                            style={styles.iconSearch}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={importCustomPokemon}>
                        <Image
                            source={Assets.icons.import}
                            style={styles.iconSearch}
                        />
                    </TouchableOpacity>
                </View>
                <View style={styles.containerDisplay}>
                    <Text style={styles.textDisplay}>List</Text>
                    <Switch
                        trackColor={{ true: "#0891B2", false: "#C9C9C9" }}
                        thumbColor={"white"}
                        onValueChange={toggleSwitch}
                        value={isTiles}
                        style={styles.switchDisplay}
                    />
                    <Text style={styles.textDisplay}>Tile</Text>
                </View>
            </View>
            {isError ? (
                <DisplayError message="Impossible de récupérer les Pokémons" />
            ) : isTiles ? (
                <FlatGrid
                    itemDimension={80}
                    spacing={10}
                    data={results}
                    keyExtractor={(item) =>
                        item.url ? getPokemonId(item.url) : item.id
                    }
                    renderItem={({ item }) => (
                        <PokemonTileItem
                            key={item.id}
                            pokemonData={item}
                            onClick={() => {
                                navigatePokemonDetails(item.id);
                            }}
                        />
                    )}
                    onEndReached={loadMorePokemons}
                    onEndReachedThreshold={0.1}
                    refreshing={isRefreshing}
                    onRefresh={newSearchPokemons}
                />
            ) : (
                <FlatList
                    data={results}
                    keyExtractor={(item) =>
                        item.url ? getPokemonId(item.url) : item.id
                    }
                    renderItem={({ item }) => (
                        <PokemonListItem
                            pokemonData={item}
                            onClick={() => {
                                navigatePokemonDetails(item.id);
                            }}
                        />
                    )}
                    onEndReached={loadMorePokemons}
                    onEndReachedThreshold={0.1}
                    refreshing={isRefreshing}
                    onRefresh={newSearchPokemons}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 12,
        marginTop: 16,
    },
    searchContainer: {
        flexDirection: "row",
    },
    containerDisplay: {
        flexDirection: "row",
        justifyContent: "flex-end",
    },
    containerControls: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    containerImportExport: {
        flexDirection: "row",
    },
    textDisplay: {
        marginVertical: 9.5,
    },
    switchDisplay: {
        height: 40,
        marginLeft: 5,
    },
    inputSearchTerm: {
        flex: 2,
        borderWidth: 1,
        backgroundColor: "#F5F5F5",
        borderColor: "#e8e8e8",
        color: "#868686",
        borderRadius: 4,
        paddingHorizontal: 10,
        marginRight: 5,
    },
    iconSearch: {
        width: 24,
        height: 24,
        tintColor: Colors.primary_blue,
        marginTop: 8,
        marginRight: 7,
    },
    filterSelector: {
        flex: 1,
    },
    inputSelector: {
        borderWidth: 1,
        backgroundColor: "#F5F5F5",
        borderColor: "#e8e8e8",
        color: "#868686",
        padding: 10,
        height: 40,
        borderRadius: 4,
    },
});
