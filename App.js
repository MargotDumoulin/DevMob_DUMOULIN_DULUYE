import {StatusBar} from 'expo-status-bar';
import {NavigationContainer} from "@react-navigation/native";
import RootStack from "./src/components/RootStack";

export default function App() {
    return (
        <NavigationContainer>
            <RootStack/>
            <StatusBar style="auto"/>
        </NavigationContainer>
    );
}