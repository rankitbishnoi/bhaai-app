import {combineReducers, configureStore} from '@reduxjs/toolkit';

import bhaaiReducer, {bhaaiListApi} from './features/bhaai/bhaai-slice';
import baanReducer, {baanListApi} from './features/bhaai/baan-slice';
import {
  persistStore,
  persistReducer,
  FLUSH,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  REHYDRATE,
} from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';

const rootReducers = combineReducers({
  bhaaiList: bhaaiReducer,
  baanList: baanReducer,
  [bhaaiListApi.reducerPath]: bhaaiListApi.reducer,
  [baanListApi.reducerPath]: baanListApi.reducer,
});

const persistedReducer = persistReducer(
  {
    key: 'root',
    version: 1,
    storage: AsyncStorage,
  },
  rootReducers,
);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(baanListApi.middleware, bhaaiListApi.middleware),
});

export const persistor = persistStore(store);

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
