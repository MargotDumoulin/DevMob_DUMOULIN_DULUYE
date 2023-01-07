import {combineReducers, configureStore} from "@reduxjs/toolkit";
import {pokemonReducer} from "./reducer/pokemonReducer";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
    persistReducer,
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
} from 'redux-persist';

const persistConfig = {
    key: "root",
    storage: AsyncStorage
};

const reducers = combineReducers({cachePokemons: pokemonReducer.reducer});
const persistedReducer = persistReducer(persistConfig, reducers);

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
        }),
});