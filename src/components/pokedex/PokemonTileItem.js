import React from "react";
import { View, StyleSheet, Image, TouchableOpacity } from "react-native";

import Assets from "../../definitions/Assets";
import Colors from "../../definitions/Colors";

const PokemonTileItem = ({ pokemonData, onClick }) => {
    const { image } = pokemonData;

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
        </TouchableOpacity>
    );
};

export default PokemonTileItem;

const styles = StyleSheet.create({
    container: {
        padding: 4
    },
    poster: {
        width: 80,
        height: 80,
        borderRadius: 100,
        borderWidth: 1,
        backgroundColor: Colors.white,
    },
    noPoster: {
        width: 80,
        height: 80,
        alignItems: "center",
        justifyContent: "center",
    }
});
