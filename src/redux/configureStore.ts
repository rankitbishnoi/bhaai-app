import {configureStore} from '@reduxjs/toolkit';

import monitorReducersEnhancer from './enhancers/monitorReducers';
import {enableMapSet} from 'immer';
import loggerMiddleware from './middleware/logger';
import bhaaiReducer, {bhaaiListApi} from './features/bhaai/bhaai-slice';
import baanReducer, {baanListApi} from './features/bhaai/baan-slice';
import {persistStore} from 'redux-persist';

enableMapSet();

const storeBase = configureStore({
  reducer: {
    bhaaiList: bhaaiReducer,
    baanList: baanReducer,
    [bhaaiListApi.reducerPath]: bhaaiListApi.reducer,
    [baanListApi.reducerPath]: baanListApi.reducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware().concat(
      bhaaiListApi.middleware,
      baanListApi.middleware,
    ),
  enhancers: [monitorReducersEnhancer],
});

export const store = storeBase;

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof storeBase.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof storeBase.dispatch;
