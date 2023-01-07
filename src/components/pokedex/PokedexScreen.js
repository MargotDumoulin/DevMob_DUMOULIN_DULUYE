import {Text, View} from "react-native";
import {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {loadPokemonCache} from "../../store/reducer/pokemonReducer";

export const PokedexScreen = () => {
    const [nameIdList, setNameIdList] = useState([]);

    const cachePokemons = useSelector((state) => state.cachePokemons.pokemonList);
    const dispatch = useDispatch();

    const onLoad = async () => {
        console.log(cachePokemons.length === 0);
        if (cachePokemons.length === 0) {
            console.log("Chargement du cache pokémon");

            dispatch(loadPokemonCache());
        }
        else {
            console.log("Les pokémons sont déjà chargés");
        }
    }

    useEffect(() => {
        onLoad().then(() => {});
    }, []);

    return (
        <View>
            <Text>Pokédex Screen</Text>
        </View>
    );
}