import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import AsyncStorage from "@react-native-async-storage/async-storage";

import pokemonsReducer from "./reducers/pokemonsSlice";

const configPersist = {
    key: "root",
    storage: AsyncStorage,
};

const persistedReducer = persistReducer(configPersist, pokemonsReducer);

export const store = configureStore({
    reducer: {
        pokemons: persistedReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            immutableCheck: false,
            thunk: false,
            serializableCheck: false,
        }),
});

export const persistor = persistStore(store);
