import {combineReducers, configureStore} from '@reduxjs/toolkit';

import bhaaiReducer, {bhaaiListApi} from './features/slices/bhaai-slice';
import baanReducer, {baanListApi} from './features/slices/baan-slice';
import profileReducer, {profileApi} from './features/slices/profile-slice';
import messageReducer from './features/slices/message-slice';
import themeReducer from './features/slices/theme-slice';
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
  profile: profileReducer,
  message: messageReducer,
  theme: themeReducer,
  [bhaaiListApi.reducerPath]: bhaaiListApi.reducer,
  [baanListApi.reducerPath]: baanListApi.reducer,
  [profileApi.reducerPath]: profileApi.reducer,
});

const persistedReducer = persistReducer(
  {
    key: 'root',
    version: 1,
    storage: AsyncStorage,
    whitelist: ['bhaaiList', 'baanList', 'profile', 'message', 'theme'],
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
