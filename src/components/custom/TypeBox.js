import React from "react";
import {StyleSheet, Text, View} from "react-native";
import Colors from "../../definitions/Colors";
import {capitalize} from "../../utils/methods";

export const TypeBox = ({type}) => {

    return (
        <View style={[styles.box, {backgroundColor: Colors.types[type]}]}>
            <Text style={styles.content}>
                {capitalize(type)}
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    box: {
        minWidth: 70,
        maxWidth: 70,
        borderRadius: 10,
        padding: 0,
        marginRight: 5
    },
    content: {
        color: "white",
        textAlign: "center",
        fontStyle: "normal",
        fontVariant: [
            "small-caps"
        ]
    }
});