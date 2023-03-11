import {useEffect, useState} from "react";
import React from "react";
import {View, TextInput, StyleSheet, FlatList, Switch, Text, Image, TouchableOpacity} from "react-native";
import {
    getPokemonId,
    getPokemonById,
    getAllPokemons,
} from "../../api/PokeAPIPokemon";
import Colors from "../../definitions/Colors";
import DisplayError from "../DisplayError";
import PokemonListItem from "./PokemonListItem";
import {useDispatch, useSelector} from "react-redux";
import {
    addPokemonsCache,
    addPokemonDetails,
} from "../../store/reducers/pokemonsSlice";
import PokemonTileItem from "./PokemonTileItem";
import { FlatGrid } from 'react-native-super-grid';
import Assets from "../../definitions/Assets";

const limit = 20;

export const PokedexScreen = ({navigation}) => {
    // const [pokemons, setPokemons] = useState([]);
    const [filter, setFilter] = React.useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [results, setResults] = useState([]);
    const [isMorePages, setIsMorePages] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [isError, setIsError] = useState(false);
    const [isMounted, setIsMounted] = useState(false);
    const [isTiles, setIsTiles] = useState(false);
    const filters = [
        {key:'1', value:'New'},
        {key:'2', value:'Original'},
        {key:'3', value:'Favorites'},
        {key:'4', value:'All'},
    ]

    const pokemonsCached = useSelector((state) => state.pokemons.pokemonsCache);

    const dispatch = useDispatch();

    const toggleSwitch = () => setIsTiles(previousState => !previousState);

    const newSearchPokemon = () => {
    };

    useEffect(() => {
        cachePokemons();
    }, []);

    useEffect(() => {
        // Once cache is setup, we can initiate the search
        if (pokemonsCached.length > 0 && !isMounted) {
            console.log({pokemonsCachedTaille: pokemonsCached.length});
            searchPokemons([], 1);
            setIsMounted(true);
        }
    }, [pokemonsCached]);

    const cachePokemons = async () => {
        // Setup cache
        const res = await getAllPokemons();
        dispatch(addPokemonsCache(res.results));
        console.log({resTaille: res.results.length});
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
                    if (!pokemon.id) {
                        // If the pokemon has an id, it means it's already loaded!
                        pokeDetails = await getPokemonById(
                            getPokemonId(pokemon.url)
                        );
                        dispatch(addPokemonDetails(pokeDetails));
                    }
                    pokemonsToAdd.push(
                        pokeDetails ? {...pokeDetails, ...pokemon} : pokemon
                    );
                }
            }

            setResults([...currentPokemons, ...pokemonsToAdd]);
            setCurrentPage(pageToRequest);
            pageToRequest === pokemonsCached.length / limit
                ? setIsMorePages(false)
                : setIsMorePages(true);
        } catch (error) {
            console.error({error});
            setIsError(true);
            setIsMorePages(true);
            setCurrentPage(1);
        }

        setIsRefreshing(false);
    };

    const navigatePokemonDetails = (pokemonID) => {
        navigation.navigate("ViewPokemon", {pokemonID});
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
                <TouchableOpacity onPress={newSearchPokemons}>
                    <Image source={Assets.icons.search} style={styles.iconSearch}/>
                </TouchableOpacity>
            </View>
            <View style={styles.containerDisplay}>
                <Text style={styles.textDisplay}>List</Text>
                <Switch
                    trackColor={{true: '#0891B2', false: '#C9C9C9'}}
                    thumbColor={"white"}
                    onValueChange={toggleSwitch}
                    value={isTiles}
                />
                <Text style={styles.textDisplay}>Tile</Text>
            </View>
            {isError ?
                <DisplayError message="Impossible de récupérer les Pokémons"/> :
                isTiles ?
                    <FlatGrid
                        itemDimension={80}
                        spacing={10}
                        data={results}
                        keyExtractor={(item) => getPokemonId(item.url)}
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
                    /> :
                    <FlatList
                        data={results}
                        keyExtractor={(item) => getPokemonId(item.url)}
                        renderItem={({item}) => (
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

            }
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
        marginBottom: 16,
        backgroundColor: "lightgrey"
    },
    containerDisplay: {
        flexDirection: "row",
        justifyContent: "flex-end"
    },
    textDisplay: {
        marginVertical: 14
    },
    inputSearchTerm: {
        marginBottom: 16,
    },
    iconSearch: {
        width: 32,
        height: 32,
        tintColor: Colors.primary_blue
    }
});
