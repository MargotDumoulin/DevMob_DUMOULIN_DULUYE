import { useForm, Controller } from "react-hook-form";
import { useEffect, useState } from "react";
import {
    Text,
    View,
    StyleSheet,
    Image,
    Button,
    ScrollView,
    TextInput,
} from "react-native";
import Autocomplete from "react-native-autocomplete-input";
import ModalSelector from "react-native-modal-selector-searchable";
import { Keyboard, Platform } from "react-native";
import {
    Spinner,
    Input,
    // Autocomplete,
    // AutocompleteItem,
} from "@ui-kitten/components";
import { Divider } from "../general/Divider";
import Assets from "../../definitions/Assets";
import { getAllLocationsLight } from "../../api/PokeAPILocation";

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
    const [loading, setLoading] = useState(true);
    const [locations, setLocations] = useState();
    const [chosenLocation, setChosenLocation] = useState();
    const [placement, setPlacement] = useState("bottom");
    const data = [
        { key: 1, section: true, label: "Fruits" },
        { key: 2, label: "Red Apples" },
        { key: 3, label: "Cherries" },
        {
            key: 4,
            label: "Cranberries",
            accessibilityLabel: "Tap here for cranberries",
        },
        // etc...
        // Can also add additional custom keys which are passed to the onChange callback
        { key: 5, label: "Vegetable", customKey: "Not a fruit" },
    ];

    const showEvent = Platform.select({
        android: "keyboardDidShow",
        default: "keyboardWillShow",
    });

    const hideEvent = Platform.select({
        android: "keyboardDidHide",
        default: "keyboardWillHide",
    });

    const renderLocationOption = (item, index) => (
        <AutocompleteItem key={index} title={item.name} />
    );

    const onSelect = (index) => {
        setChosenLocation(locations[index].name);
    };

    const onChangeText = (query) => {
        setChosenLocation(query);
    };

    useEffect(() => {
        const keyboardShowListener = Keyboard.addListener(showEvent, () => {
            setPlacement("top");
        });

        const keyboardHideListener = Keyboard.addListener(hideEvent, () => {
            setPlacement("bottom");
        });

        return () => {
            keyboardShowListener.remove();
            keyboardHideListener.remove();
        };
    });

    const onSubmit = (data) => {
        console.log(data);
    };

    const navigateToTakePicture = () => {
        navigation.navigate("TakePicture");
    };

    const fetchData = async () => {
        const res = await getAllLocationsLight();
        setChosenLocation(res[0]);
        setLocations(res);
        console.log({ res });
        setLoading(false);
    };

    const items = [
        {
            id: 1,
            name: "JavaScript",
        },
        {
            id: 2,
            name: "Java",
        },
        {
            id: 3,
            name: "Ruby",
        },
        {
            id: 4,
            name: "React Native",
        },
        {
            id: 5,
            name: "PHP",
        },
        {
            id: 6,
            name: "Python",
        },
        {
            id: 7,
            name: "Go",
        },
        {
            id: 8,
            name: "Swift",
        },
    ];

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        if (route?.params?.newPokemonImage) {
            setNewPokemonImage(route?.params?.newPokemonImage);
        }
    }, [route?.params?.newPokemonImage]);

    return (
        <ScrollView style={styles.container} keyboardShouldPersistTaps="always">
            {loading ? (
                <Spinner />
            ) : (
                <View style={styles.container}>
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
                            <Button
                                title="Ajouter"
                                onPress={navigateToTakePicture}
                            />
                        </View>
                        <View style={styles.mainInfoControllerContainer}>
                            <Controller
                                control={control}
                                rules={{
                                    required: true,
                                    maxLength: 100,
                                }}
                                render={({
                                    field: { onChange, onBlur, value },
                                }) => (
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
                            {/* <View style={styles.autocompleteContainer}>
                                <Autocomplete
                                    data={locations}
                                    value={chosenLocation}
                                    onChangeText={(text) =>
                                        setChosenLocation({ name: text })
                                    }
                                    flatListProps={{
                                        keyExtractor: (_, idx) => idx,
                                        renderItem: ({ item }) => (
                                            <Text>{item.name}</Text>
                                        ),
                                    }}
                                />
                            </View> */}
                            <ModalSelector
                                data={locations}
                                keyExtractor={(item) => item.id}
                                labelExtractor={(item) => item.name}
                                onChange={(option) => {
                                    console.log({ option });
                                    setChosenLocation(option);
                                }}
                            >
                                <TextInput
                                    style={{
                                        borderWidth: 1,
                                        backgroundColor: "#F5F5F5",
                                        borderColor: "#e8e8e8",
                                        color: "#868686",
                                        padding: 10,
                                        height: 40,
                                        borderRadius: 4,
                                    }}
                                    editable={false}
                                    placeholder="Canalave City"
                                    value={chosenLocation.name}
                                />
                            </ModalSelector>
                            {/* <Controller
                                control={control}
                                styles={styles.autocomplete}
                                rules={{
                                    maxLength: 100,
                                    required: true,
                                }}
                                render={() => (
                                    <Autocomplete
                                        styles={styles.autocomplete}
                                        placeholder="Region"
                                        value={chosenLocation}
                                        onSelect={onSelect}
                                        onChangeText={onChangeText}
                                        placement={placement}
                                    >
                                        {locations.map(renderLocationOption)}
                                    </Autocomplete>
                                )}
                                name="type"
                            /> */}
                            {/* <SearchableDropdown
                                onItemSelect={(item) => {
                                    console.log({ item });
                                    setChosenLocation(item);
                                }}
                                itemStyle={{
                                    padding: 10,
                                    borderColor: "#e3e3e3",
                                    borderWidth: 1,
                                }}
                                itemTextStyle={{ color: "#9a9a9a" }}
                                itemsContainerStyle={{ maxHeight: 140 }}
                                items={locations}
                                defaultIndex={0}
                                resetValue={false}
                                textInputProps={{
                                    underlineColorAndroid: "transparent",
                                    style: {
                                        height: 40,
                                        padding: 10,
                                        borderWidth: 1,
                                        backgroundColor: "#f5f5f5",
                                        borderColor: "#e3e3e3",
                                        borderRadius: 5,
                                    },
                                }}
                                listProps={{
                                    nestedScrollEnabled: true,
                                }}
                            /> */}
                            {/* <Autocomplete
                                data={locations}
                                value={chosenLocation.name}
                                onChangeText={(text) =>
                                    setChosenLocation({
                                        name: text,
                                        coords: [],
                                    })
                                }
                                flatListProps={{
                                    keyExtractor: (_, idx) => idx,
                                    renderItem: ({ item }) => (
                                        <Text>{item.name}</Text>
                                    ),
                                }}
                            /> */}
                        </View>
                    </View>

                    <Divider text="Base Info" width="90" />

                    <View style={styles.pokemonBaseStatsContainer}>
                        <Controller
                            control={control}
                            rules={{
                                maxLength: 100,
                            }}
                            render={({
                                field: { onChange, onBlur, value },
                            }) => (
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
                            render={({
                                field: { onChange, onBlur, value },
                            }) => (
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

                    <Divider text="Type(s)" width="90" />

                    <View style={styles.pokemonBaseStatsContainer}>
                        <Controller
                            control={control}
                            rules={{
                                maxLength: 100,
                            }}
                            render={({
                                field: { onChange, onBlur, value },
                            }) => (
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
                            render={({
                                field: { onChange, onBlur, value },
                            }) => (
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

                    <Divider text="Base stats" width="90" />

                    <View style={styles.pokemonBaseStatsContainer}>
                        <Controller
                            control={control}
                            rules={{
                                maxLength: 100,
                            }}
                            render={({
                                field: { onChange, onBlur, value },
                            }) => (
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
                            render={({
                                field: { onChange, onBlur, value },
                            }) => (
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
                            render={({
                                field: { onChange, onBlur, value },
                            }) => (
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
                            render={({
                                field: { onChange, onBlur, value },
                            }) => (
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
                            render={({
                                field: { onChange, onBlur, value },
                            }) => (
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
                            render={({
                                field: { onChange, onBlur, value },
                            }) => (
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

                    <Divider text="Abilties" width="90" />

                    <View style={styles.pokemonBaseStatsContainer}>
                        <Controller
                            control={control}
                            rules={{
                                maxLength: 100,
                            }}
                            render={({
                                field: { onChange, onBlur, value },
                            }) => (
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
                            render={({
                                field: { onChange, onBlur, value },
                            }) => (
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
                            render={({
                                field: { onChange, onBlur, value },
                            }) => (
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
                            render={({
                                field: { onChange, onBlur, value },
                            }) => (
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
                </View>
            )}

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
    autocomplete: {
        height: 50,
        backgroundColor: "yellow",
    },
    autocompleteContainer: {
        flex: 1,
        left: 0,
        position: "absolute",
        right: 0,
        top: 0,
        zIndex: 1,
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
