import React, {useState} from "react";
import {Image, ScrollView, StyleSheet, Text, View,} from "react-native";
import {useDispatch, useSelector} from "react-redux";

import DisplayError from "../DisplayError";

import Colors from "../../definitions/Colors";
import Assets from "../../definitions/Assets";
import {capitalize} from "../../utils/methods";
import {BaseStatProgressBar} from "../custom/BaseStatProgressBar";
import {TypeBox} from "../custom/TypeBox";

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
                                <View style={styles.containerTypes}>
                                    <TypeBox type={pokemon.types[0]}/>
                                    {pokemon.types.length > 1 ?
                                        <TypeBox type={pokemon.types[1]}/> :
                                        ""
                                    }
                                </View>
                                <Text>
                                    <Text style={styles.contentTitle}>Abilities : </Text>
                                    {pokemon.abilities.map(type => capitalize(type)).join(" - ")}
                                </Text>
                                <Text>
                                    <Text style={styles.contentTitle}>Height : </Text>
                                    {pokemon.height >= 10 ? `${pokemon.height / 10} m` : `${pokemon.height * 10} cm`}
                                </Text>
                                <Text>
                                    <Text style={styles.contentTitle}>Weight : </Text>
                                    {pokemon.weight >= 10 ? `${pokemon.weight / 10} kg` : `${pokemon.weight * 100} g`}
                                </Text>
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
                                    <Text>
                                        <Text style={styles.contentTitle}>HP : </Text>
                                        {pokemon.baseStats.healthPoint}
                                    </Text>
                                    <Text>
                                        <Text style={styles.contentTitle}>ATK : </Text>
                                        {pokemon.baseStats.attack}
                                    </Text>
                                    <Text>
                                        <Text style={styles.contentTitle}>DEF : </Text>
                                        {pokemon.baseStats.defense}
                                    </Text>
                                    <Text>
                                        <Text style={styles.contentTitle}>SP ATK : </Text>
                                        {pokemon.baseStats.attackSpe}
                                    </Text>
                                    <Text>
                                        <Text style={styles.contentTitle}>SP DEF : </Text>
                                        {pokemon.baseStats.defenseSpe}
                                    </Text>
                                    <Text>
                                        <Text style={styles.contentTitle}>SPEED : </Text>
                                        {pokemon.baseStats.speed}
                                    </Text>
                                </View>
                                <View style={styles.containerGauge}>
                                    <BaseStatProgressBar stat={pokemon.baseStats.healthPoint}
                                                         myStyle={styles.progressBar}/>
                                    <BaseStatProgressBar stat={pokemon.baseStats.attack} myStyle={styles.progressBar}/>
                                    <BaseStatProgressBar stat={pokemon.baseStats.defense} myStyle={styles.progressBar}/>
                                    <BaseStatProgressBar stat={pokemon.baseStats.attackSpe}
                                                         myStyle={styles.progressBar}/>
                                    <BaseStatProgressBar stat={pokemon.baseStats.defenseSpe}
                                                         myStyle={styles.progressBar}/>
                                    <BaseStatProgressBar stat={pokemon.baseStats.speed} myStyle={styles.progressBar}/>
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
    },
    containerBaseStats: {
        flexDirection: "row"
    },
    containerTypes: {
        flexDirection: "row",
        marginBottom: 3
    },
    image: {
        width: 250,
        height: 250,
        borderRadius: 10,
        borderWidth: 1,
    },
    progressBar: {
        marginVertical: 6.7
    },
    contentTitle: {
        color: "red",
        fontWeight: "bold"
    }
});
