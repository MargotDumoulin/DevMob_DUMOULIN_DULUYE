import React, {useState, useEffect} from "react";
import {
    View,
    StyleSheet,
    Text,
    ActivityIndicator,
    ScrollView,
    Image,
    Button,
} from "react-native";
import {useSelector, useDispatch} from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-root-toast";

import DisplayError from "../DisplayError";

import Colors from "../../definitions/Colors";
import Assets from "../../definitions/Assets";
import {capitalize} from "../../utils/methods";

export const Pokemon = ({route}) => {
    const [isError, setIsError] = useState(false);
    const pokemon = useSelector((state) =>
        state.pokemons.pokemonsCache.find(
            (pokemon) => pokemon.id == route.params.pokemonID
        )
    );
    const dispatch = useDispatch();

    console.log(pokemon);

    const getImage = () => {
        if (pokemon.image) {
            return (
                <Image
                    style={styles.image}
                    source={{
                        uri: pokemon.image,
                    }}
                />
            );
        }
        return (
            <View style={styles.noPoster}>
                <Image style={styles.image} source={Assets.icons.missingIMG}/>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            {isError ? (
                <DisplayError message="Impossible de récupérer les données du Pokemon"/>
            ) : (
                <ScrollView style={styles.containerScroll}>
                    <View style={styles.card}>
                        <View style={styles.containerImage}>{getImage()}</View>
                        <View style={styles.containerInformation}>
                            <View style={styles.containerTitle}>
                                <Text style={styles.title}>
                                    {capitalize(pokemon.name)}
                                </Text>
                            </View>
                            <View style={styles.containerData}>
                                <Text>Type : {pokemon.types.map(type => capitalize(type)).join(" - ")}</Text>
                                <Text>Abilities : {pokemon.abilities.map(type => capitalize(type)).join(" - ")}</Text>
                                <Text>Height : {pokemon.height} cm</Text>
                                <Text>Weight : {pokemon.weight} kg</Text>
                            </View>
                        </View>
                    </View>
                    <View style={styles.card}>
                        <View style={styles.containerInformation}>
                            <View style={styles.containerTitle}>
                                <Text style={styles.title}>Base stats</Text>
                            </View>
                            <View style={styles.containerBaseStats}>
                                <View style={styles.containerData}>
                                    <Text>HP : {pokemon.baseStats.healthPoint}</Text>
                                    <Text>ATK : {pokemon.baseStats.attack}</Text>
                                    <Text>DEF : {pokemon.baseStats.defense}</Text>
                                    <Text>SP ATK : {pokemon.baseStats.attackSpe}</Text>
                                    <Text>SP DEF : {pokemon.baseStats.defenseSpe}</Text>
                                    <Text>SPEED : {pokemon.baseStats.speed}</Text>
                                </View>
                                <View style={styles.containerGauge}>
                                    <Text><Image source={{uri: Assets.image.fullJauge}}/></Text>
                                    <Text>ATK : {pokemon.baseStats.attack}</Text>
                                    <Text>DEF : {pokemon.baseStats.defense}</Text>
                                    <Text>SP ATK : {pokemon.baseStats.attackSpe}</Text>
                                    <Text>SP DEF : {pokemon.baseStats.defenseSpe}</Text>
                                    <Text>SPEED : {pokemon.baseStats.speed}</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                </ScrollView>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    containerScroll: {
        flex: 1,
        paddingHorizontal: 12,
        paddingVertical: 16,
    },
    card: {
        backgroundColor: "white",
        flex: 1,
        borderRadius: 10,
        marginBottom: 10
    },
    title: {
        fontSize: 20,
    },
    containerImage: {
        display: "flex",
        alignItems: "center",
        backgroundColor: Colors.darkGrey,
        borderTopRightRadius: 10,
        borderTopLeftRadius: 10,
    },
    containerTitle: {
        margin: 15,
        marginBottom: 0
    },
    containerInformation: {
        borderBottomRightRadius: 10,
        borderBottomLeftRadius: 10,
    },
    containerData: {
        margin: 15,
        flex: 1
    },
    containerGauge: {
        margin: 15,
        flex: 3,
        backgroundColor: "yellow"
    },
    containerBaseStats: {
        flexDirection: "row"
    },
    image: {
        width: 250,
        height: 250,
        borderRadius: 10,
        borderWidth: 1,
    },
});
