import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MapScreen } from "./map/MapScreen";
import { PokedexScreen } from "./pokedex/PokedexScreen";
import { Pokemon } from "./pokedex/Pokemon";
import { CreatePokemonScreen } from "./create/CreatePokemonScreen";
import { TakePicture } from "./create/TakePicture";
import Colors from "../definitions/Colors";
import {Image, StyleSheet} from "react-native";
import Assets from "../definitions/Assets";

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
                options={{title: "Pokémon"}}
            />
            <PokedexStackNavigator.Screen
                name="MapScreen"
                component={MapScreen}
                options={{title: "Carte"}}
            />
            <CreatePokemonStackNavigator.Screen
                name="CreatePokemonScreen"
                component={CreatePokemonScreen}
                options={{title: "Création"}}
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
            <CreatePokemonStackNavigator.Screen
                name="TakePicture"
                component={TakePicture}
                options={{ title: "Photo" }}
            />
        </CreatePokemonStackNavigator.Navigator>
    );
}

function RootStack() {
    return (
        <Tab.Navigator
            screenOptions={{
                tabBarActiveTintColor: "red",
                tabBarInactiveTintColor: Colors.primary_blue,
                headerShown: false
        }}
            initialRouteName="Pokédex"
        >
            <Tab.Screen
                name="Carte"
                component={MapStack}
                options={() => ({tabBarIcon: ({focused}) => <Image source={Assets.icons.map} style={focused ? styles.iconFocused : styles.icon}/>})}/>
            <Tab.Screen
                name="Pokédex"
                component={PokedexStack}
                options={() => ({tabBarIcon: ({focused}) => <Image source={Assets.icons.pokedex} style={focused ? styles.iconFocused : styles.icon}/>})}/>
            <Tab.Screen
                name="Creation"
                component={CreatePokemonStack}
                options={() => ({tabBarIcon: ({focused}) => <Image source={Assets.icons.add} style={focused ? styles.iconFocused : styles.icon}/>})}/>
        </Tab.Navigator>
    );
}

export default RootStack;

const styles = StyleSheet.create({
    icon: {
        height: 28,
        width: 28,
        tintColor: Colors.primary_blue
    },
    iconFocused: {
        height: 28,
        width: 28,
        tintColor: "red"
    }
});