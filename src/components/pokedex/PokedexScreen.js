import { useEffect, useState } from "react";
import { View, TextInput, Button, StyleSheet, FlatList } from "react-native";
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
    addPokemonsCache,
    addPokemonDetails,
} from "../../store/reducers/pokemonsSlice";

const limit = 20;

export const PokedexScreen = ({ navigation }) => {
    // const [pokemons, setPokemons] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [results, setResults] = useState([]);
    const [isMorePages, setIsMorePages] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [isError, setIsError] = useState(false);
    const [isMounted, setIsMounted] = useState(false);

    const pokemonsCached = useSelector((state) => state.pokemons.pokemonsCache);

    const dispatch = useDispatch();

    const newSearchPokemon = () => {};

    useEffect(() => {
        cachePokemons();
    }, []);

    useEffect(() => {
        // Once cache is setup, we can initiate the search
        if (pokemonsCached.length > 0 && !isMounted) {
            console.log({ pokemonsCachedTaille: pokemonsCached.length });
            searchPokemons([], 1);
            setIsMounted(true);
        }
    }, [pokemonsCached]);

    const cachePokemons = async () => {
        // Setup cache
        const res = await getAllPokemons();
        dispatch(addPokemonsCache(res.results));
        console.log({ resTaille: res.results.length });
    };

    const searchPokemons = async (currentPokemons, pageToRequest) => {
        setIsRefreshing(true);
        setIsError(false);

        try {
            const pokemonsSearched = searchTerm
                ? pokemonsCached.filter((pokemon) =>
                      pokemon.name.startsWith(searchTerm)
                  )
                : pokemonsCached;

            const offset = (pageToRequest - 1) * limit;
            const pokemonsToAdd = [];

            // Go through pokemons cache and get details for each pokemon needed
            for (let index = offset; index < limit * pageToRequest; index++) {
                const pokemon = pokemonsSearched[index];
                let pokeDetails = undefined;
                if (pokemon) {
                    console.log({ pokemonName: pokemon });
                    if (!pokemon.id) {
                        // If the pokemon has an id, it means it's already loaded!
                        pokeDetails = await getPokemonById(
                            getPokemonId(pokemon.url)
                        );
                        dispatch(addPokemonDetails(pokeDetails));
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

    return (
        <View style={styles.container}>
            <View style={styles.searchContainer}>
                <TextInput
                    placeholder="Pokémon à chercher"
                    style={styles.inputSearchTerm}
                    onChangeText={(text) => setSearchTerm(text)}
                    onSubmitEditing={newSearchPokemon}
                />
                <Button
                    title="Rechercher"
                    color={Colors.primary_blue}
                    onPress={newSearchPokemons}
                />
            </View>
            {isError ? (
                <DisplayError message="Impossible de récupérer les Pokémons" />
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
        marginBottom: 16,
    },
    inputSearchTerm: {
        marginBottom: 16,
    },
});
