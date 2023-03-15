import {configureStore} from '@reduxjs/toolkit';

import monitorReducersEnhancer from './enhancers/monitorReducers';
import loggerMiddleware from './middleware/logger';
import bhaaiReducer, {bhaaiListApi} from './features/bhaai/bhaai-slice';
import {persistStore} from 'redux-persist';

const storeBase = configureStore({
  reducer: {
    bhaaiList: bhaaiReducer,
    [bhaaiListApi.reducerPath]: bhaaiListApi.reducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware().concat(bhaaiListApi.middleware),
  enhancers: [monitorReducersEnhancer],
});

export const store = storeBase;

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof storeBase.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof storeBase.dispatch;
