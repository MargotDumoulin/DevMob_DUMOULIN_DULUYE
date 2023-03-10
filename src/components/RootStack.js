import {createStackNavigator} from "@react-navigation/stack";
import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import {MapScreen} from "./map/MapScreen";
import {PokedexScreen} from "./pokedex/PokedexScreen";
import {Pokemon} from "./pokedex/Pokemon";
import {CreatePokemonScreen} from "./create/CreatePokemonScreen";
import Assets from "../definitions/Assets";
import {Image, StyleSheet} from "react-native";
import Colors from "../definitions/Colors";

const MapStackNavigator = createStackNavigator();
const PokedexStackNavigator = createStackNavigator();
const CreatePokemonStackNavigator = createStackNavigator();

const Tab = createBottomTabNavigator();

function MapStack() {
    return (
        <MapStackNavigator.Navigator initialRouteName="MapScreen">
            <MapStackNavigator.Screen
                name="MapScreen"
                component={MapScreen}
                options={{title: "Carte"}}
            />
        </MapStackNavigator.Navigator>
    );
}

function PokedexStack() {
    return (
        <PokedexStackNavigator.Navigator initialRouteName="PokedexScreen">
            <PokedexStackNavigator.Screen
                name="PokedexScreen"
                component={PokedexScreen}
                options={{title: "Pokédex"}}
            />
            <PokedexStackNavigator.Screen
                name="ViewPokemon"
                component={Pokemon}
                options={{title: "Pokédex"}}
            />
            <MapStackNavigator.Screen
                name="MapScreen"
                component={MapScreen}
                options={{title: "Carte"}}
            />
        </PokedexStackNavigator.Navigator>
    );
}

function CreatePokemonStack() {
    return (
        <CreatePokemonStackNavigator.Navigator initialRouteName="CreatePokemonScreen">
            <CreatePokemonStackNavigator.Screen
                name="CreatePokemonScreen"
                component={CreatePokemonScreen}
                options={{title: "Création"}}
            />
        </CreatePokemonStackNavigator.Navigator>
    );
}

function RootStack() {
    return (
        <Tab.Navigator
            screenOptions={{
                tabBarActiveTintColor: Colors.primary_blue,
                headerShown: false
        }}
            initialRouteName="Pokédex"
        >
            <Tab.Screen
                name="Carte"
                component={MapStack}
                options={() => ({
                    tabBarIcon: () => {
                        return (
                            <Image source={Assets.icons.map} style={styles.icon}/>
                        );
                    },
                })}/>
            <Tab.Screen
                name="Pokédex"
                component={PokedexStack}
                options={() => ({
                    tabBarIcon: () => {
                        return (
                            <Image source={Assets.icons.pokedex} style={styles.icon}/>
                        );
                    },
                })}/>
            <Tab.Screen
                name="Creation"
                component={CreatePokemonStack}
                options={() => ({
                    tabBarIcon: () => {
                        return (
                            <Image source={Assets.icons.add} style={styles.icon}/>
                        );
                    },
                })}/>
        </Tab.Navigator>
    );
}

export default RootStack;

const styles = StyleSheet.create({
    icon: {
        height: 32,
        width: 32
    }
});