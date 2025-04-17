import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage
import userReducer from './slice/userSlice'; // adjust path as needed

const persistConfig = {
    key: 'root',
    storage,
    whitelist: ['user'], // only persist the 'user' slice
};

const rootReducer = combineReducers({
    user: userReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false, // redux-persist uses non-serializable values
        }),
});

export const persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>;
