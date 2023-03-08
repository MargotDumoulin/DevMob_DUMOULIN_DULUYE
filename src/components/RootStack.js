import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MapScreen } from "./map/MapScreen";
import { PokedexScreen } from "./pokedex/PokedexScreen";
import { Pokemon } from "./pokedex/Pokemon";
import { CreatePokemonScreen } from "./create/CreatePokemonScreen";
import { TakePicture } from "./create/TakePicture";

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
                options={{ title: "Carte" }}
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
                options={{ title: "Pokédex" }}
            />
            <PokedexStackNavigator.Screen
                name="ViewPokemon"
                component={Pokemon}
                options={{ title: "Pokédex" }}
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
                options={{ title: "Création" }}
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
            screenOptions={{ headerShown: false }}
            initialRouteName="Pokédex"
        >
            <Tab.Screen name="Carte" component={MapStack} />
            <Tab.Screen name="Pokédex" component={PokedexStack} />
            <Tab.Screen name="Creation" component={CreatePokemonStack} />
        </Tab.Navigator>
    );
}

export default RootStack;
