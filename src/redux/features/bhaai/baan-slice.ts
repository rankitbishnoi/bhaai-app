import {createSlice, PayloadAction} from '@reduxjs/toolkit';

import {Baan} from '../../../types/Baan';
import {BaanList} from '../../../types/BaanList';
import {ApiSlice} from '../api-slice';

const initialState: Record<string, Baan[]> = {};

export const baanListApi = ApiSlice.injectEndpoints({
  endpoints: builder => ({
    getBaanList: builder.query<BaanList, void>({
      query: () => ({
        url: 'baan',
        method: 'GET',
      }),
    }),
    createBaan: builder.mutation<Baan, {bhaaiId: string; body: Baan}>({
      query: data => ({
        url: `bhaai/${data.bhaaiId}/baan`,
        method: 'POST',
        body: data.body,
      }),
    }),
    updatedBaan: builder.mutation<Baan, {bhaaiId: string; body: Baan}>({
      query: data => ({
        url: `bhaai/${data.bhaaiId}/baan/${data.body._id}`,
        method: 'PUT',
        body: data.body,
      }),
    }),
    deleteBaan: builder.mutation<Baan, {bhaaiId: string; id: string}>({
      query: data => ({
        url: `bhaai/${data.bhaaiId}/baan/${data.id}`,
        method: 'DELETE',
      }),
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetBaanListQuery,
  useCreateBaanMutation,
  useDeleteBaanMutation,
  useUpdatedBaanMutation,
} = baanListApi;

const baanSlice = createSlice({
  name: 'baanList',
  initialState,
  reducers: {
    // createBaan
    createdBaan(state, action: PayloadAction<{bhaaiId: string; body: Baan}>) {
      const list = state[action.payload.bhaaiId];
      if (list) {
        list.push(action.payload.body);
      }
    },
    // updateBaan
    updatedBaan(state, action: PayloadAction<{bhaaiId: string; body: Baan}>) {
      const list = state[action.payload.bhaaiId];
      if (list) {
        const foundIndex = list.findIndex(
          a => a._id === action.payload.body._id,
        );
        if (foundIndex > -1) {
          list.splice(foundIndex, 1, {
            ...action.payload.body,
            bhaaiId: action.payload.bhaaiId,
          });
        }
      }
    },
    // deleteBaan
    deletedBaan(state, action: PayloadAction<{bhaaiId: string; id: string}>) {
      const list = state[action.payload.bhaaiId];
      if (list) {
        const foundIndex = list.findIndex(a => a._id === action.payload.id);
        if (foundIndex > -1) {
          list.splice(foundIndex, 1);
        }
      }
    },
  },
  extraReducers: builder => {
    builder.addMatcher(
      baanListApi.endpoints.getBaanList.matchFulfilled,
      (state, {payload}) => {
        const list: any = {};
        payload.forEach(a => {
          if (!a.bhaaiId) {
            return;
          }

          if (list[a.bhaaiId]) {
            list[a.bhaaiId].push(a);
          } else {
            list[a.bhaaiId] = [a];
          }
        });
        return list;
      },
    );
  },
});

export const {createdBaan, deletedBaan, updatedBaan} = baanSlice.actions;

export default baanSlice.reducer;
