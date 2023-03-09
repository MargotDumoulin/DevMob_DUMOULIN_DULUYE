import { useForm, Controller } from "react-hook-form";
import { useEffect, useState } from "react";
import {
    Text,
    View,
    StyleSheet,
    Image,
    Button,
    ScrollView,
} from "react-native";
import { IndexPath, Input, Select, SelectItem } from "@ui-kitten/components";
import { Divider } from "../general/Divider";
import Assets from "../../definitions/Assets";

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
    const [selectedIndex, setSelectedIndex] = useState(new IndexPath(0));

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
        <ScrollView style={styles.container}>
            <View style={styles.mainInfoContainer}>
                <View style={styles.pictureContainer}>
                    <Image
                        style={styles.image}
                        source={
                            newPokemonImage
                                ? {
                                      uri: newPokemonImage,
                                  }
                                : Assets.icons.missingIMG
                        }
                    />
                    <Button title="Ajouter" onPress={navigateToTakePicture} />
                </View>
                <View style={styles.mainInfoControllerContainer}>
                    <Controller
                        control={control}
                        rules={{
                            required: true,
                        }}
                        render={({ field: { onChange, onBlur, value } }) => (
                            <Input
                                style={styles.input}
                                placeholder="Nom du pokémon"
                                onBlur={onBlur}
                                onChangeText={onChange}
                                value={value}
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
                        render={({ field }) => (
                            <Select
                                style={styles.input}
                                selectedIndex={selectedIndex}
                                onSelect={(index) => setSelectedIndex(index)}
                            >
                                <SelectItem title="Option 1" />
                                <SelectItem title="Option 2" />
                                <SelectItem title="Option 3" />
                            </Select>
                        )}
                        name="type"
                    />
                    <Controller
                        control={control}
                        rules={{
                            maxLength: 100,
                        }}
                        render={({ field }) => (
                            <Select
                                style={styles.input}
                                selectedIndex={selectedIndex}
                                onSelect={(index) => setSelectedIndex(index)}
                            >
                                <SelectItem title="Option 1" />
                                <SelectItem title="Option 2" />
                                <SelectItem title="Option 3" />
                            </Select>
                        )}
                        name="region"
                    />
                </View>
            </View>

            <Divider text="Base stats" width="90" />

            <View style={styles.pokemonBaseStatsContainer}>
                <Controller
                    control={control}
                    rules={{
                        maxLength: 100,
                    }}
                    render={({ field: { onChange, onBlur, value } }) => (
                        <Input
                            style={styles.input}
                            placeholder="HP"
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                        />
                    )}
                    name="hp"
                />
                <Controller
                    control={control}
                    rules={{
                        maxLength: 100,
                    }}
                    render={({ field: { onChange, onBlur, value } }) => (
                        <Input
                            style={styles.input}
                            placeholder="ATT"
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                        />
                    )}
                    name="att"
                />
                <Controller
                    control={control}
                    rules={{
                        maxLength: 100,
                    }}
                    render={({ field: { onChange, onBlur, value } }) => (
                        <Input
                            style={styles.input}
                            placeholder="DEF"
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                        />
                    )}
                    name="def"
                />
                <Controller
                    control={control}
                    rules={{
                        maxLength: 100,
                    }}
                    render={({ field: { onChange, onBlur, value } }) => (
                        <Input
                            style={styles.input}
                            placeholder="SP ATT"
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                        />
                    )}
                    name="spAtt"
                />
                <Controller
                    control={control}
                    rules={{
                        maxLength: 100,
                    }}
                    render={({ field: { onChange, onBlur, value } }) => (
                        <Input
                            style={styles.input}
                            placeholder="SP DEF"
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                        />
                    )}
                    name="spDef"
                />
                <Controller
                    control={control}
                    rules={{
                        maxLength: 100,
                    }}
                    render={({ field: { onChange, onBlur, value } }) => (
                        <Input
                            style={styles.input}
                            placeholder="SPEED"
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                        />
                    )}
                    name="speed"
                />
            </View>

            <Divider text="Base Info" width="90" />

            <View style={styles.pokemonBaseStatsContainer}>
                <Controller
                    control={control}
                    rules={{
                        maxLength: 100,
                    }}
                    render={({ field: { onChange, onBlur, value } }) => (
                        <Input
                            style={styles.input}
                            placeholder="Height"
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                        />
                    )}
                    name="height"
                />
                <Controller
                    control={control}
                    rules={{
                        maxLength: 100,
                    }}
                    render={({ field: { onChange, onBlur, value } }) => (
                        <Input
                            style={styles.input}
                            placeholder="Weight"
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                        />
                    )}
                    name="weight"
                />
            </View>

            <Divider text="Base Info" width="90" />

            <View style={styles.pokemonBaseStatsContainer}>
                <Controller
                    control={control}
                    rules={{
                        maxLength: 100,
                    }}
                    render={({ field: { onChange, onBlur, value } }) => (
                        <Input
                            style={styles.input}
                            placeholder="Compétence une"
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                        />
                    )}
                    name="ability_one"
                />
                <Controller
                    control={control}
                    rules={{
                        maxLength: 100,
                    }}
                    render={({ field: { onChange, onBlur, value } }) => (
                        <Input
                            style={styles.input}
                            placeholder="Compétence deux"
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                        />
                    )}
                    name="ability_two"
                />
                <Controller
                    control={control}
                    rules={{
                        maxLength: 100,
                    }}
                    render={({ field: { onChange, onBlur, value } }) => (
                        <Input
                            style={styles.input}
                            placeholder="Compétence trois"
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                        />
                    )}
                    name="ability_three"
                />
                <Controller
                    control={control}
                    rules={{
                        maxLength: 100,
                    }}
                    render={({ field: { onChange, onBlur, value } }) => (
                        <Input
                            style={styles.input}
                            placeholder="Compétence quatre"
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                        />
                    )}
                    name="ability_four"
                />
            </View>

            <Button title="Valider" onPress={handleSubmit(onSubmit)} />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        margin: 10,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: "bold",
    },
    picker: {
        backgroundColor: "white",
        borderRadius: 10,
    },
    input: {
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
    controller: {
        marginBottom: 10,
    },
    divider: {
        borderBottomColor: "lightgrey",
        borderBottomWidth: StyleSheet.hairlineWidth,
        marginTop: 20,
        marginBottom: 5,
    },
    mainInfoControllerContainer: {
        marginTop: 2,
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
        borderRadius: 10,
        borderWidth: 1,
        marginBottom: 5,
    },
});
