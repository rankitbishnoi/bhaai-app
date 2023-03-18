import {createSlice, PayloadAction} from '@reduxjs/toolkit';

import {Bhaai} from '../../../types/Bhaai';
import {ApiSlice} from '../api-slice';
import {revertAll} from '../actions/revertAll';
import {createModel, mergeModel, Model} from '../helper';

const initialState: Model<Bhaai>[] = [];

export const bhaaiListApi = ApiSlice.injectEndpoints({
  endpoints: builder => ({
    getBhaaiList: builder.query<Bhaai[], void>({
      query: () => ({
        url: 'bhaai',
        method: 'GET',
      }),
      providesTags: ['Bhaai'],
    }),
    createBhaai: builder.mutation<Bhaai, Bhaai>({
      query: body => ({
        url: 'bhaai',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Bhaai'],
    }),
    updatedBhaai: builder.mutation<Bhaai, Bhaai>({
      query: body => ({
        url: `bhaai/${body._id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['Bhaai'],
    }),
    deleteBhaai: builder.mutation<Bhaai, string>({
      query: id => ({
        url: `bhaai/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Bhaai'],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetBhaaiListQuery,
  useCreateBhaaiMutation,
  useDeleteBhaaiMutation,
  useUpdatedBhaaiMutation,
} = bhaaiListApi;

const bhaaiSlice = createSlice({
  name: 'bhaaiList',
  initialState,
  reducers: {
    // createBhaai
    createdBhaai(state, action: PayloadAction<Bhaai>) {
      state.push(createModel<Bhaai>(action.payload));
    },
    // updateBhaai
    updatedBhaai(state, action: PayloadAction<Bhaai>) {
      const foundIndex = state.findIndex(a => a._id === action.payload._id);
      if (foundIndex > -1) {
        state.splice(foundIndex, 1, createModel<Bhaai>(action.payload));
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
    builder.addCase(revertAll, () => initialState);
    builder.addMatcher(
      bhaaiListApi.endpoints.getBhaaiList.matchFulfilled,
      (state, {payload}) => {
        return mergeModel<Bhaai>(state, payload);
      },
    );
  },
});

export const {createdBhaai, deletedBhaai, updatedBhaai} = bhaaiSlice.actions;

export default bhaaiSlice.reducer;
