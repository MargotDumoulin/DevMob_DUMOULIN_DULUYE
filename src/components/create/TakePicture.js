import { Text, View, Button, StyleSheet, TouchableOpacity } from "react-native";
import { Camera, CameraType } from "expo-camera";
import { useState, useRef } from "react";

export const TakePicture = ({ navigation, route }) => {
    const [type, setType] = useState(CameraType.back);
    const [permission, requestPermission] = Camera.useCameraPermissions();
    const camera = useRef(null);

    const takePicture = async () => {
        try {
            const res = await camera.current.takePictureAsync();
            navigation.navigate("CreatePokemonScreen", {
                newPokemonImage: res.uri,
                ...(route?.params?.pokemonID
                    ? { pokemonID: route?.params?.pokemonID }
                    : {}),
            });
        } catch (e) {
            console.log({ e });
        }
    };

    if (!permission) {
        // Camera permissions are still loading
        return <View />;
    }

    if (!permission.granted) {
        // Camera permissions are not granted yet
        return (
            <View style={styles.container}>
                <Text style={{ textAlign: "center" }}>
                    We need your permission to show the camera
                </Text>
                <Button onPress={requestPermission} title="grant permission" />
            </View>
        );
    }

    const toggleCameraType = () => {
        setType((current) =>
            current === CameraType.back ? CameraType.front : CameraType.back
        );
    };

    return (
        <View style={styles.container}>
            <Camera style={styles.camera} type={type} ref={camera}>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={toggleCameraType}
                    >
                        <Text style={styles.text}>Flip Camera</Text>
                        <Text style={styles.subtext}>
                            When clicking on the button, please wait a few
                            seconds before being redirected.
                        </Text>
                    </TouchableOpacity>
                </View>
            </Camera>
            <Button title="Take a picture" onPress={takePicture} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
    },
    camera: {
        flex: 1,
    },
    buttonContainer: {
        flex: 1,
        flexDirection: "row",
        backgroundColor: "transparent",
        margin: 64,
    },
    button: {
        flex: 1,
        alignSelf: "flex-end",
        alignItems: "center",
    },
    text: {
        fontSize: 24,
        fontWeight: "bold",
        color: "white",
    },
    subtext: {
        fontSize: 16,
        color: "lightgrey",
    },
});
