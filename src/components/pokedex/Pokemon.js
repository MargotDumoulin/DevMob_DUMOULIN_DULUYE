import React, {useEffect, useState} from "react";
import {
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import {useDispatch, useSelector} from "react-redux";

import DisplayError from "../DisplayError";

import Colors from "../../definitions/Colors";
import Assets from "../../definitions/Assets";
import {capitalize, transformName} from "../../utils/methods";
import {BaseStatProgressBar} from "../custom/BaseStatProgressBar";
import {TypeBox} from "../custom/TypeBox";
import {getLocationById} from "../../api/PokeAPILocation";
import {addPokemonFav, removePokemonFav} from "../../store/reducers/pokemonsSlice";

export const Pokemon = ({navigation, route}) => {
    const [locations, setLocation] = useState([]);
    const [isError, setIsError] = useState(false);
    const [fav, setFav] =
        useState(
            useSelector((state) =>
                state.pokemons.pokemonsFav.includes(route.params.pokemonID)
            )
        );
    const pokemon = useSelector((state) =>
        state.pokemons.pokemonsCache.find(
            (pokemon) => pokemon.id === route.params.pokemonID
        )
    );

    const dispatch = useDispatch();

    const loadLocations = async () => {
        if (pokemon.locations.length > 0) {
            let locationList = [];

            for (let locationId of pokemon.locations) {
                locationList = [
                    ...locationList,
                    await getLocationById(locationId),
                ];
            }

            setLocation(locationList);
        }
    };

    const favs = () => {
        if (fav) {
            dispatch(removePokemonFav(pokemon.id));
        } else {
            dispatch(addPokemonFav(pokemon.id));
        }
        setFav(!fav);
    };
    const updatePokemon = () => {
        console.log("Update");
    }
    const removePokemon = () => {
        console.log("Remove");
    }

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

    const navigateMap = (location) => {
        navigation.navigate("MapScreen", {location});
    };

    useEffect(() => {
        loadLocations();
    }, []);

    return (
        <View style={styles.container}>
            {isError ? (
                <DisplayError message="Impossible de récupérer les données du Pokemon"/>
            ) : (
                <ScrollView style={styles.containerScroll}>
                    <View style={styles.card}>
                        <View style={styles.containerImage}>
                            {getImage()}
                            <TouchableOpacity
                                style={styles.favIconContainer}
                                onPress={favs}
                            >
                                {fav ? (
                                    <Image
                                        source={Assets.icons.fav}
                                        style={styles.favIcon}
                                    />
                                ) : (
                                    <Image
                                        source={Assets.icons.favent}
                                        style={styles.faventIcon}
                                    />
                                )}
                            </TouchableOpacity>
                        </View>
                        <View style={styles.containerInformation}>
                            <View style={styles.containerTitle}>
                                <Text style={styles.title}>
                                    {capitalize(pokemon.name)}
                                </Text>
                                {pokemon?.isNew ?
                                    <View style={styles.containerNew}>
                                        <TouchableOpacity onPress={updatePokemon}>
                                            <Image source={Assets.icons.update} style={styles.updateIcon}/>
                                        </TouchableOpacity>
                                        <View></View>
                                        <Text style={styles.new}>NEW</Text>
                                    </View> :
                                    ""
                                }
                            </View>
                            <View style={styles.containerData}>
                                <View style={styles.containerTypes}>
                                    {pokemon.types.map((type) => {
                                        return (
                                            <TypeBox type={type} key={type}/>
                                        );
                                    })}
                                </View>
                                <Text>
                                    <Text style={styles.contentTitle}>
                                        Abilities :{" "}
                                    </Text>
                                    {pokemon.abilities
                                        .map((type) => capitalize(type))
                                        .join(" - ")}
                                </Text>
                                <Text>
                                    <Text style={styles.contentTitle}>
                                        Height :{" "}
                                    </Text>
                                    {pokemon.height >= 10
                                        ? `${pokemon.height / 10} m`
                                        : `${pokemon.height * 10} cm`}
                                </Text>
                                <Text>
                                    <Text style={styles.contentTitle}>
                                        Weight :{" "}
                                    </Text>
                                    {pokemon.weight >= 10
                                        ? `${pokemon.weight / 10} kg`
                                        : `${pokemon.weight * 100} g`}
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
                                        <Text style={styles.contentTitle}>
                                            HP :{" "}
                                        </Text>
                                        {pokemon.baseStats.healthPoint}
                                    </Text>
                                    <Text>
                                        <Text style={styles.contentTitle}>
                                            ATK :{" "}
                                        </Text>
                                        {pokemon.baseStats.attack}
                                    </Text>
                                    <Text>
                                        <Text style={styles.contentTitle}>
                                            DEF :{" "}
                                        </Text>
                                        {pokemon.baseStats.defense}
                                    </Text>
                                    <Text>
                                        <Text style={styles.contentTitle}>
                                            SP ATK :{" "}
                                        </Text>
                                        {pokemon.baseStats.attackSpe}
                                    </Text>
                                    <Text>
                                        <Text style={styles.contentTitle}>
                                            SP DEF :{" "}
                                        </Text>
                                        {pokemon.baseStats.defenseSpe}
                                    </Text>
                                    <Text>
                                        <Text style={styles.contentTitle}>
                                            SPEED :{" "}
                                        </Text>
                                        {pokemon.baseStats.speed}
                                    </Text>
                                </View>
                                <View style={styles.containerJauge}>
                                    <BaseStatProgressBar
                                        stat={pokemon.baseStats.healthPoint}
                                        myStyle={styles.progressBar}
                                    />
                                    <BaseStatProgressBar
                                        stat={pokemon.baseStats.attack}
                                        myStyle={styles.progressBar}
                                    />
                                    <BaseStatProgressBar
                                        stat={pokemon.baseStats.defense}
                                        myStyle={styles.progressBar}
                                    />
                                    <BaseStatProgressBar
                                        stat={pokemon.baseStats.attackSpe}
                                        myStyle={styles.progressBar}
                                    />
                                    <BaseStatProgressBar
                                        stat={pokemon.baseStats.defenseSpe}
                                        myStyle={styles.progressBar}
                                    />
                                    <BaseStatProgressBar
                                        stat={pokemon.baseStats.speed}
                                        myStyle={styles.progressBar}
                                    />
                                </View>
                            </View>
                        </View>
                    </View>
                    {locations.length > 0 ?
                        <View style={pokemon?.isNew ? styles.card : [styles.card, styles.lastCard]}>
                            <View style={styles.containerInformation}>
                                <View style={styles.containerTitle}>
                                    <Text style={styles.title}>Locations</Text>
                                </View>
                                <View style={styles.containerData}>
                                    {locations
                                        .filter(
                                            (location) => location !== undefined
                                        )
                                        .map((location) => {
                                            return (
                                                <TouchableOpacity
                                                    key={location.id}
                                                    onPress={() => {
                                                        navigateMap(
                                                            location.baseName
                                                        );
                                                    }}
                                                    style={
                                                        styles.containerLocation
                                                    }
                                                >
                                                    <Image
                                                        source={
                                                            Assets.icons.goToMap
                                                        }
                                                        style={styles.mapIcon}
                                                    />
                                                    <Text>
                                                        {transformName(
                                                            location.baseName
                                                        )}
                                                    </Text>
                                                </TouchableOpacity>
                                            );
                                        })}
                                </View>
                            </View>
                        </View> :
                        ""
                    }
                    {pokemon?.isNew ?
                        <View style={styles.containerBin}>
                            <TouchableOpacity onPress={removePokemon}>
                                <Image source={Assets.icons.bin} style={styles.binIcon}/>
                            </TouchableOpacity>
                        </View> :
                        ""
                    }
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
    lastCard: {
        marginBottom: 25
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
        marginBottom: 0,
        flexDirection: "row"
    },
    containerInformation: {
        borderBottomRightRadius: 10,
        borderBottomLeftRadius: 10,
    },
    containerData: {
        margin: 15,
        flex: 1,
    },
    containerJauge: {
        margin: 15,
        flex: 3,
    },
    containerBaseStats: {
        flexDirection: "row",
    },
    containerTypes: {
        flexDirection: "row",
        marginBottom: 3,
    },
    image: {
        width: 335,
        height: 250,
        borderTopRightRadius: 10,
        borderTopLeftRadius: 10,
        borderWidth: 1,
    },
    progressBar: {
        marginVertical: 6.7,
    },
    contentTitle: {
        color: "red",
        fontWeight: "bold",
    },
    containerLocation: {
        flexDirection: "row",
        marginVertical: 2,
    },
    mapIcon: {
        height: 16,
        width: 16,
        marginRight: 5,
    },
    favIconContainer: {
        position: "absolute",
        top: 16,
        right: 16,
    },
    favIcon: {
        height: 32,
        width: 32,
        tintColor: "red"
    },
    faventIcon: {
        height: 32,
        width: 32
    },
    new: {
        color: Colors.white,
        backgroundColor: Colors.greenNew,
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 4
    },
    binIcon: {
        height: 32,
        width: 32,
        marginRight: 3
    },
    updateIcon: {
        height: 24,
        width: 24,
        marginTop: 4
    },
    containerBin: {
        flexDirection: "row",
        justifyContent: "flex-end",
        marginBottom: 25
    },
    containerNew: {
        flexDirection: "row",
        justifyContent: "space-between",
        flex: 1,
        marginLeft: 10
    }
});
