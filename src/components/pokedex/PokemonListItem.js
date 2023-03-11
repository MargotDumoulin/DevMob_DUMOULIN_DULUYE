import React from "react";
import { View, StyleSheet, Image, Text, TouchableOpacity } from "react-native";

import Assets from "../../definitions/Assets";
import Colors from "../../definitions/Colors";
import {TypeBox} from "../custom/TypeBox";

const PokemonListItem = ({ pokemonData, onClick }) => {
    const { name, image, types } = pokemonData;

    const getImage = () => {
        if (image) {
            return (
                <Image
                    style={styles.poster}
                    source={{
                        uri: image,
                    }}
                />
            );
        }
        return (
            <View>
                <Image style={styles.poster} source={Assets.icons.missingIMG} />
            </View>
        );
    };

    return (
        <TouchableOpacity style={styles.container} onPress={onClick}>
            {getImage()}
            <View style={styles.informationContainer}>
                <View style={styles.titleContainer}>
                    <Text style={styles.title}>
                        {name.charAt(0).toUpperCase() + name.slice(1)}
                    </Text>
                </View>
                <View style={styles.containerTypes}>
                    {types.map((type) => {
                        return (
                            <TypeBox type={type} key={type} />
                        );
                    })}
                </View>
            </View>
        </TouchableOpacity>
    );
};

export default PokemonListItem;

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        paddingVertical: 8,
    },
    informationContainer: {
        flex: 1,
        marginLeft: 12,
        marginTop: 8,
    },
    titleContainer: {
        flexDirection: "row",
    },
    containerTypes: {
        flexDirection: "row",
        marginVertical: 5,
    },
    poster: {
        width: 80,
        height: 80,
        borderRadius: 100,
        borderWidth: 1,
        backgroundColor: Colors.white,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        flex: 1,
    }
});
