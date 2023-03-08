import { Text, View, TextInput, Button, StyleSheet, Image } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { useEffect, useState } from "react";

export const CreatePokemonScreen = ({ navigation, route }) => {
    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm({
        defaultValues: {
            firstName: "",
            lastName: "",
        },
    });

    const [newPokemonImage, setNewPokemonImage] = useState();

    const onSubmit = (data) => {
        console.log(data);
    };

    const navigateToTakePicture = () => {
        navigation.navigate("TakePicture");
    };

    useEffect(() => {
        if (route?.params?.newPokemonImage) {
            setNewPokemonImage(route?.params?.newPokemonImage);
        }
    }, [route?.params?.newPokemonImage]);

    return (
        <View style={styles.container}>
            <View style={styles.mainInfoContainer}>
                <View style={styles.pictureContainer}>
                    {newPokemonImage && (
                        <Image
                            style={styles.image}
                            source={{
                                uri: newPokemonImage,
                            }}
                        />
                    )}
                    <Button title="Ajouter" onPress={navigateToTakePicture} />
                </View>
                <View style={styles.mainInfoControllerContainer}>
                    <Controller
                        control={control}
                        rules={{
                            required: true,
                        }}
                        render={({ field: { onChange, onBlur, value } }) => (
                            <TextInput
                                style={styles.input}
                                onBlur={onBlur}
                                onChangeText={onChange}
                                value={value}
                                placeholder="Pokemon's name"
                            />
                        )}
                        name="name"
                    />
                    {errors.name && (
                        <Text style={styles.errorMessage}>
                            This is required.
                        </Text>
                    )}
                    <Controller
                        control={control}
                        rules={{
                            maxLength: 100,
                        }}
                        render={({ field: { onChange, onBlur, value } }) => (
                            <TextInput
                                style={styles.input}
                                onBlur={onBlur}
                                onChangeText={onChange}
                                value={value}
                                placeholder="Pokemon's type"
                            />
                        )}
                        name="lastName"
                    />
                </View>
            </View>

            <View style={styles.pokemonBaseStatsContainer}></View>

            <Button title="Valider" onPress={handleSubmit(onSubmit)} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        margin: 10,
    },
    input: {
        backgroundColor: "white",
        borderColor: "none",
        height: 40,
        padding: 10,
        borderRadius: 4,
        marginBottom: 10,
    },
    errorMessage: {
        color: "red",
    },
    camera: {
        flex: 1,
    },
    mainInfoContainer: {
        display: "flex",
        flexDirection: "row",
    },
    mainInfoControllerContainer: {
        flex: 1,
        marginLeft: 10,
    },
    pokemonBaseStatsContainer: {
        flex: 1,
    },
    pictureContainer: {
        width: 100,
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
    image: {
        width: 100,
        height: 100,
        borderRadius: 100,
        borderWidth: 1,
        marginBottom: 5,
    },
});
