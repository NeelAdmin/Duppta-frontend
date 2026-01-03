import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { api } from '../services/api';
import authReducer from '../features/auth/authSlice';
import { authApi } from '../features/auth/authApi';
import { designApi } from '../features/common/designApi';
import { variantApi } from '../features/common/variantApi';
import { stockApi } from '../features/common/stockApi';
// Persist configuration
const persistConfig = {
  key: 'root',
  version: 1,
  storage,
  whitelist: ['auth'],
};

const persistedReducer = persistReducer(persistConfig, authReducer);

// Create the Redux store
export const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer,
    [authApi.reducerPath]: authApi.reducer,
    [designApi.reducerPath]: designApi.reducer,
    [variantApi.reducerPath]: variantApi.reducer,
    [stockApi.reducerPath]: stockApi.reducer,
    auth: persistedReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    })
      .concat(api.middleware)
      .concat(authApi.middleware)
      .concat(designApi.middleware)
      .concat(variantApi.middleware)
      .concat(stockApi.middleware),
});

setupListeners(store.dispatch);

export const persistor = persistStore(store);

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
