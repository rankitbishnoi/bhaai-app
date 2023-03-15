import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {persistReducer} from 'redux-persist';

const persistConfig = {
  key: 'bhaaiList',
  storage: AsyncStorage,
};

import {Bhaai, BhaaiBase} from '../../../types/Bhaai';
import {BhaaiList} from '../../../types/BhaaiList';
import uuid from 'react-native-uuid';
import {apiService} from '../../../services/api.service';

const initialState: BhaaiList = [];

export const bhaaiListApi = createApi({
  reducerPath: 'bhaaiListApi',
  tagTypes: ['Bhaai'],
  baseQuery: fetchBaseQuery({
    baseUrl: apiService.baseURL,
    prepareHeaders: headers => {
      headers.set(
        'authorization',
        apiService.getHeaders().headers.authorization,
      );

      return headers;
    },
  }),
  endpoints: builder => ({
    getBhaaiList: builder.query<BhaaiList, string>({
      query: () => ({
        url: 'bhaai',
        method: 'GET',
      }),
    }),
  }),
});

export const {useGetBhaaiListQuery} = bhaaiListApi;

const bhaaiSlice = createSlice({
  name: 'bhaaiList',
  initialState,
  reducers: {
    // createBhaai
    createdBhaai(state, action: PayloadAction<BhaaiBase>) {
      state.push({
        ...action.payload,
        _id: uuid.v4().toString(),
      });
    },
    // updateBhaai
    updatedBhaai(state, action: PayloadAction<Bhaai>) {
      const foundIndex = state.findIndex(a => a._id === action.payload._id);
      if (foundIndex > -1) {
        state.splice(foundIndex, 1, action.payload);
      }
    },
    // deleteBhaai
    deletedBhaai(state, action: PayloadAction<string>) {
      const foundIndex = state.findIndex(a => a._id === action.payload);
      if (foundIndex > -1) {
        state.splice(foundIndex, 1);
      }
    },
  },
  extraReducers: builder => {
    builder.addMatcher(
      bhaaiListApi.endpoints.getBhaaiList.matchFulfilled,
      (state, {payload}) => {
        console.log(state, {payload}, 'state, {payload}');
        return payload;
      },
    );
  },
});

export const {createdBhaai, deletedBhaai, updatedBhaai} = bhaaiSlice.actions;

const reducer: typeof bhaaiSlice.reducer = persistReducer(
  persistConfig,
  bhaaiSlice.reducer,
) as any;

export default bhaaiSlice.reducer;