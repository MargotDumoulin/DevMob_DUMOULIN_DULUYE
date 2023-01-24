import { useEffect, useState } from "react";
import {
    View,
    TextInput,
    Button,
    StyleSheet,
    FlatList,
    Text,
} from "react-native";
import { getAllPokemons, getPokemonId } from "../../api/PokeAPIPokemon";
import Colors from "../../definitions/Colors";
import DisplayError from "../DisplayError";
import PokemonListItem from "./PokemonListItem";

export const PokedexScreen = () => {
    const [pokemons, setPokemons] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [isMorePages, setIsMorePages] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [isError, setIsError] = useState(false);

    const newSearchPokemon = () => {};

    useEffect(() => {
        searchPokemons([], 1);
    }, []);

    const searchPokemons = async (currentPokemons, pageToRequest) => {
        setIsRefreshing(true);
        setIsError(false);

        try {
            const res = await getAllPokemons(pageToRequest);
            setPokemons([...currentPokemons, ...res.results]);
            console.log([...currentPokemons, ...res.results]);
            setCurrentPage(pageToRequest);
            pageToRequest == res.count / 20
                ? setIsMorePages(false)
                : setIsMorePages(true);
        } catch (error) {
            console.log({ error });
            console.log("ICI");
            setIsError(true);
            setPokemons([]);
            setIsMorePages(true);
            setCurrentPage(1);
        }

        setIsRefreshing(false);
    };

    const newSearchPokemons = () => {
        Keyboard.dismiss();
        searchPokemons([], 1);
    };

    const loadMorePokemons = () => {
        if (isMorePages) {
            searchPokemons(pokemons, currentPage + 1);
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
                    onPress={newSearchPokemon}
                />
            </View>
            {isError ? (
                <DisplayError message="Impossible de récupérer les Pokémons" />
            ) : (
                <FlatList
                    data={pokemons}
                    keyExtractor={(item) => getPokemonId(item.url)}
                    renderItem={({ item }) => (
                        <PokemonListItem
                            pokemonData={item}
                            onClick={() => {}}
                        />
                    )}
                    onEndReached={loadMorePokemons}
                    onEndReachedThreshold={0.5}
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
