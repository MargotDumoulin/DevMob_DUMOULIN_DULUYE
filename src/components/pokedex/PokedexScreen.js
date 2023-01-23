import { Text, View } from "react-native";
import { useEffect, useState } from "react";
import { getPokemonById } from "../../api/PokeAPIPokemon";

export const PokedexScreen = () => {
    const [nameIdList, setNameIdList] = useState([]);

    const onLoad = async () => {
        console.log(await getPokemonById(35));
    };

    useEffect(() => {
        onLoad().then(() => {});
    }, []);

    return (
        <View>
            <Text>Pokédex Screen</Text>
        </View>
    );
};
