import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import { Provider } from "react-redux";
import { store, persistor } from "./src/store/config";
import RootStack from "./src/components/RootStack";

export default function App() {
    return (
        <Provider store={store}>
            <NavigationContainer>
                <RootStack />
                <StatusBar style="auto" />
            </NavigationContainer>
        </Provider>
    );
}
