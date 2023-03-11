import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import { Provider } from "react-redux";
import { store } from "./src/store/config";
import RootStack from "./src/components/RootStack";
import * as eva from "@eva-design/eva";
import { ApplicationProvider, Layout } from "@ui-kitten/components";
import * as material from "@eva-design/material";

export default function App() {
    return (
        <ApplicationProvider {...eva} theme={material.light}>
            <Provider store={store}>
                <NavigationContainer>
                    <RootStack />
                    <StatusBar style="auto" />
                </NavigationContainer>
            </Provider>
        </ApplicationProvider>
    );
}
