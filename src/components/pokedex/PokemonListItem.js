import React from "react";
import { View, StyleSheet, Image, Text, TouchableOpacity } from "react-native";

import Assets from "../../definitions/Assets";
import Colors from "../../definitions/Colors";

const PokemonListItem = ({ pokemonData, onClick }) => {
    const { name, image } = pokemonData;

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
            <View style={styles.noPoster}>
                <Image source={Assets.icons.missingIMG} />
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
                <Text style={styles.overview} numberOfLines={4}>
                    Infos...
                </Text>
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
    statsContainer: {
        flexDirection: "row",
        marginTop: 12,
    },
    titleContainer: {
        flexDirection: "row",
    },
    statContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginRight: 16,
    },
    poster: {
        width: 80,
        height: 80,
        borderRadius: 100,
        borderWidth: 1,
        backgroundColor: Colors.white,
    },
    noPoster: {
        width: 120,
        height: 180,
        alignItems: "center",
        justifyContent: "center",
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        flex: 1,
    },
    voteAverage: {
        fontSize: 16,
        fontWeight: "bold",
        color: Colors.primary_blue,
    },
    voteCount: {
        fontSize: 14,
        alignSelf: "flex-end",
        fontStyle: "italic",
    },
    overview: {
        fontSize: 16,
    },
    icon: {
        tintColor: Colors.primary_blue,
        width: 20,
        height: 20,
        marginRight: 4,
    },
    highlight: {
        tintColor: Colors.primary_blue,
        width: 20,
        height: 20,
        marginHorizontal: 4,
        marginTop: 6,
    },
});
