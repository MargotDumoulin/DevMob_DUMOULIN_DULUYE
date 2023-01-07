import {StatusBar} from 'expo-status-bar';
import {NavigationContainer} from "@react-navigation/native";
import RootStack from "./src/components/RootStack";
import {store} from "./src/store/store";
import {RootSiblingParent} from 'react-native-root-siblings';
import {PersistGate} from "redux-persist/integration/react";
import {persistStore} from "redux-persist";
import {Provider} from "react-redux";

export default function App() {
    let persistor = persistStore(store);

    return (
        <RootSiblingParent>
            <Provider store={store}>
                <PersistGate loading={null} persistor={persistor}>
                    <NavigationContainer>
                        <RootStack/>
                        <StatusBar style="auto"/>
                    </NavigationContainer>
                </PersistGate>
            </Provider>
        </RootSiblingParent>
    );
}