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
import ModalSelector from "react-native-modal-selector-searchable";
import { Spinner, Input } from "@ui-kitten/components";
import { Divider } from "../general/Divider";
import Assets from "../../definitions/Assets";
import { getAllLocationsLight } from "../../api/PokeAPILocation";
import { getAllTypesLight } from "../../api/PokeAPIType";
import { useDispatch, useSelector } from "react-redux";
import {
    addNewPokemon,
    updatePokemon,
} from "../../store/reducers/pokemonsSlice";

export const CreatePokemonScreen = ({ navigation, route }) => {
    const dispatch = useDispatch();
    const [newPokemonImage, setNewPokemonImage] = useState();
    const [loading, setLoading] = useState(true);
    const [locations, setLocations] = useState();
    const [types, setTypes] = useState();
    const [chosenLocation, setChosenLocation] = useState();
    const [chosenTypeOne, setChosenTypeOne] = useState();
    const [chosenTypeOptional, setChosenTypeOptional] = useState();

    const existingPokemon = useSelector((state) =>
        state.pokemons.pokemonsCache.find(
            (pokemon) => pokemon.id === route?.params?.pokemonID
        )
    );

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm({
        defaultValues: existingPokemon?.id
            ? {
                  name: existingPokemon.name,
                  height: existingPokemon.height,
                  weight: existingPokemon.weight,
                  abilityOne: existingPokemon.abilities[0],
                  abilityTwo: existingPokemon.abilities[1],
                  abilityThree: existingPokemon.abilities[2],
                  abilityFour: existingPokemon.abilities[3],
                  hp: existingPokemon.baseStats.healthPoint,
                  att: existingPokemon.baseStats.attack,
                  def: existingPokemon.baseStats.def,
                  attackSpe: existingPokemon.baseStats.spAtt,
                  defenseSpe: existingPokemon.baseStats.spDef,
                  speed: existingPokemon.baseStats.speed,
              }
            : {},
    });

    const onSubmit = (data) => {
        const pokemon = {
            ...(existingPokemon?.id ? { id: existingPokemon.id } : {}),
            locations: [chosenLocation.id],
            image: newPokemonImage,
            name: data.name,
            isNew: true,
            baseStats: {
                healthPoint: data.hp,
                attack: data.att,
                defense: data.def,
                attackSpe: data.spAtt,
                defenseSpe: data.spDef,
                speed: data.speed,
            },
            height: data.height,
            weight: data.weight,
            types: [
                chosenTypeOne.name.toLowerCase(),
                ...(chosenTypeOptional
                    ? [chosenTypeOptional.name.toLowerCase()]
                    : []),
            ],
            abilities: [
                data.abilityOne.toLowerCase(),
                ...(data.abilityTwo ? [data.abilityTwo.toLowerCase()] : []),
                ...(data.abilityThree ? [data.abilityThree.toLowerCase()] : []),
                ...(data.abilityFour ? [data.abilityFour.toLowerCase()] : []),
            ],
        };

        const mutationToUse = !existingPokemon?.id
            ? addNewPokemon(pokemon)
            : updatePokemon(pokemon);

        dispatch(mutationToUse);

        navigation.navigate("Pokédex", { refreshResults: true });
    };

    const navigateToTakePicture = () => {
        navigation.navigate("TakePicture", {
            ...(existingPokemon?.id ? { pokemonID: existingPokemon.id } : {}),
        });
    };

    const fetchData = async () => {
        const resLoc = await getAllLocationsLight();
        const resTypes = await getAllTypesLight();

        setLocations(resLoc);
        setTypes(resTypes);

        if (existingPokemon?.id) {
            setChosenLocation(
                resLoc.find((loc) => loc.id === existingPokemon.locations[0])
            );

            setChosenTypeOne(
                resTypes.find(
                    (type) =>
                        type.name.toLowerCase() ===
                        existingPokemon.types[0].toLowerCase()
                )
            );

            if (existingPokemon.types.length > 1) {
                setChosenTypeOptional(
                    resTypes.find(
                        (type) =>
                            type.name.toLowerCase() ===
                            existingPokemon.types[1].toLowerCase()
                    )
                );
            }

            setNewPokemonImage(existingPokemon.image);
        } else {
            setChosenTypeOne(resTypes[0]);
            setChosenLocation(resLoc[0]);
        }

        setLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, [route?.params?.pokemonID]);

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
                                title="Add"
                                onPress={navigateToTakePicture}
                            />
                        </View>
                        <View style={styles.mainInfoControllerContainer}>
                            <Controller
                                control={control}
                                rules={{
                                    required: true,
                                }}
                                render={({
                                    field: { onChange, onBlur, value },
                                }) => (
                                    <Input
                                        style={styles.input}
                                        placeholder="Pokemon's name"
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
                            <ModalSelector
                                data={locations}
                                keyExtractor={(item) => item.id}
                                labelExtractor={(item) => item.name}
                                onChange={(option) => {
                                    setChosenLocation(option);
                                }}
                            >
                                <TextInput
                                    style={styles.modalAutocompleteInput}
                                    editable={false}
                                    placeholder="Canalave City"
                                    value={chosenLocation.name}
                                />
                            </ModalSelector>
                        </View>
                    </View>

                    <Divider text="Base Info" width="90" />

                    <View style={styles.pokemonBaseStatsContainer}>
                        <Controller
                            control={control}
                            rules={{
                                required: true,
                                pattern: {
                                    value: /\d+/,
                                },
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
                        {errors.height && (
                            <Text style={styles.errorMessage}>
                                This is required & must be a number.
                            </Text>
                        )}
                        <Controller
                            control={control}
                            rules={{
                                required: true,
                                pattern: {
                                    value: /\d+/,
                                },
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
                        {errors.weight && (
                            <Text style={styles.errorMessage}>
                                This is required & must be a number.
                            </Text>
                        )}
                    </View>

                    <Divider text="Type(s)" width="90" />

                    <View style={styles.pokemonBaseStatsContainer}>
                        <ModalSelector
                            data={types}
                            style={{ marginBottom: 10 }}
                            keyExtractor={(item) => item.id}
                            labelExtractor={(item) => item.name}
                            onChange={(option) => {
                                setChosenTypeOne(option);
                            }}
                        >
                            <TextInput
                                style={styles.modalAutocompleteInput}
                                editable={false}
                                placeholder="Canalave City"
                                value={chosenTypeOne.name}
                            />
                        </ModalSelector>
                        <ModalSelector
                            data={types}
                            keyExtractor={(item) => item.id}
                            labelExtractor={(item) => item.name}
                            onChange={(option) => {
                                setChosenTypeOptional(option);
                            }}
                        >
                            <TextInput
                                style={styles.modalAutocompleteInput}
                                editable={false}
                                placeholder="Optional second type"
                                value={chosenTypeOptional?.name}
                            />
                        </ModalSelector>
                    </View>

                    <Divider text="Base stats" width="90" />

                    <View style={styles.pokemonBaseStatsContainer}>
                        <Controller
                            control={control}
                            rules={{
                                required: true,
                                pattern: {
                                    value: /\d+/,
                                },
                            }}
                            render={({
                                field: { onChange, onBlur, value },
                            }) => (
                                <Input
                                    style={styles.input}
                                    placeholder="HP"
                                    onBlur={onBlur}
                                    type="number"
                                    onChangeText={onChange}
                                    value={value}
                                />
                            )}
                            name="hp"
                        />
                        {errors.hp && (
                            <Text style={styles.errorMessage}>
                                This is required & must be a number.
                            </Text>
                        )}
                        <Controller
                            control={control}
                            rules={{
                                required: true,
                                pattern: {
                                    value: /\d+/,
                                },
                            }}
                            render={({
                                field: { onChange, onBlur, value },
                            }) => (
                                <Input
                                    style={styles.input}
                                    placeholder="ATT"
                                    onBlur={onBlur}
                                    type="number"
                                    onChangeText={onChange}
                                    value={value}
                                />
                            )}
                            name="att"
                        />
                        {errors.att && (
                            <Text style={styles.errorMessage}>
                                This is required & must be a number.
                            </Text>
                        )}
                        <Controller
                            control={control}
                            rules={{
                                required: true,
                                pattern: {
                                    value: /\d+/,
                                },
                            }}
                            render={({
                                field: { onChange, onBlur, value },
                            }) => (
                                <Input
                                    style={styles.input}
                                    placeholder="DEF"
                                    onBlur={onBlur}
                                    type="number"
                                    onChangeText={onChange}
                                    value={value}
                                />
                            )}
                            name="def"
                        />
                        {errors.def && (
                            <Text style={styles.errorMessage}>
                                This is required & must be a number.
                            </Text>
                        )}
                        <Controller
                            control={control}
                            rules={{
                                required: true,
                                pattern: {
                                    value: /\d+/,
                                },
                            }}
                            render={({
                                field: { onChange, onBlur, value },
                            }) => (
                                <Input
                                    style={styles.input}
                                    placeholder="SP ATT"
                                    onBlur={onBlur}
                                    type="number"
                                    onChangeText={onChange}
                                    value={value}
                                />
                            )}
                            name="spAtt"
                        />
                        {errors.spAtt && (
                            <Text style={styles.errorMessage}>
                                This is required & must be a number.
                            </Text>
                        )}
                        <Controller
                            control={control}
                            rules={{
                                required: true,
                                pattern: {
                                    value: /\d+/,
                                },
                            }}
                            render={({
                                field: { onChange, onBlur, value },
                            }) => (
                                <Input
                                    style={styles.input}
                                    placeholder="SP DEF"
                                    onBlur={onBlur}
                                    type="number"
                                    onChangeText={onChange}
                                    value={value}
                                />
                            )}
                            name="spDef"
                        />
                        {errors.spDef && (
                            <Text style={styles.errorMessage}>
                                This is required & must be a number.
                            </Text>
                        )}
                        <Controller
                            control={control}
                            rules={{
                                required: true,
                                pattern: {
                                    value: /\d+/,
                                },
                            }}
                            render={({
                                field: { onChange, onBlur, value },
                            }) => (
                                <Input
                                    style={styles.input}
                                    placeholder="SPEED"
                                    onBlur={onBlur}
                                    type="number"
                                    onChangeText={onChange}
                                    value={value}
                                />
                            )}
                            name="speed"
                        />
                        {errors.speed && (
                            <Text style={styles.errorMessage}>
                                This is required & must be a number.
                            </Text>
                        )}
                    </View>

                    <Divider text="Abilties" width="90" />

                    <View style={styles.pokemonBaseStatsContainer}>
                        <Controller
                            control={control}
                            rules={{
                                required: true,
                            }}
                            render={({
                                field: { onChange, onBlur, value },
                            }) => (
                                <Input
                                    style={styles.input}
                                    placeholder="Ability 1"
                                    onBlur={onBlur}
                                    onChangeText={onChange}
                                    value={value}
                                />
                            )}
                            name="abilityOne"
                        />
                        {errors.abilityOne && (
                            <Text style={styles.errorMessage}>
                                This is required
                            </Text>
                        )}
                        <Controller
                            control={control}
                            render={({
                                field: { onChange, onBlur, value },
                            }) => (
                                <Input
                                    style={styles.input}
                                    placeholder="Ability 2"
                                    onBlur={onBlur}
                                    onChangeText={onChange}
                                    value={value}
                                />
                            )}
                            name="abilityTwo"
                        />
                        <Controller
                            control={control}
                            render={({
                                field: { onChange, onBlur, value },
                            }) => (
                                <Input
                                    style={styles.input}
                                    placeholder="Ability 3"
                                    onBlur={onBlur}
                                    onChangeText={onChange}
                                    value={value}
                                />
                            )}
                            name="abilityThree"
                        />
                        <Controller
                            control={control}
                            render={({
                                field: { onChange, onBlur, value },
                            }) => (
                                <Input
                                    style={styles.input}
                                    placeholder="Ability 4"
                                    onBlur={onBlur}
                                    onChangeText={onChange}
                                    value={value}
                                />
                            )}
                            name="abilityFour"
                        />
                    </View>
                </View>
            )}

            <Button
                title={existingPokemon?.id ? "Edit" : "Save"}
                onPress={handleSubmit(onSubmit)}
            />
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
        marginTop: -10,
        marginBottom: 5,
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
    modalAutocompleteInput: {
        borderWidth: 1,
        backgroundColor: "#F5F5F5",
        borderColor: "#e8e8e8",
        color: "#868686",
        padding: 10,
        height: 40,
        borderRadius: 4,
    },
});
