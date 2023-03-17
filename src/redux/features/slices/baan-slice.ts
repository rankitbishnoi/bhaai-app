import {createSlice, PayloadAction} from '@reduxjs/toolkit';

import {Baan} from '../../../types/Baan';
import {BaanList} from '../../../types/BaanList';
import {ApiSlice} from '../api-slice';
import {revertAll} from '../actions/revertAll';
import {createModel, mergeModel, Model} from '../helper';

const initialState: Record<string, Model<Baan>[]> = {};

export const baanListApi = ApiSlice.injectEndpoints({
  endpoints: builder => ({
    getBaanList: builder.query<BaanList, void>({
      query: () => ({
        url: 'baan',
        method: 'GET',
      }),
      providesTags: ['Baan'],
    }),
    createBaan: builder.mutation<Baan, {bhaaiId: string; body: Baan}>({
      query: data => ({
        url: `bhaai/${data.bhaaiId}/baan`,
        method: 'POST',
        body: data.body,
      }),
      invalidatesTags: ['Baan'],
    }),
    updatedBaan: builder.mutation<Baan, {bhaaiId: string; body: Baan}>({
      query: data => ({
        url: `bhaai/${data.bhaaiId}/baan/${data.body._id}`,
        method: 'PUT',
        body: data.body,
      }),
      invalidatesTags: ['Baan'],
    }),
    deleteBaan: builder.mutation<Baan, {bhaaiId: string; id: string}>({
      query: data => ({
        url: `bhaai/${data.bhaaiId}/baan/${data.id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Baan'],
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
        list.push(createModel<Baan>(action.payload.body));
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
          list.splice(
            foundIndex,
            1,
            createModel<Baan>({
              ...action.payload.body,
              bhaaiId: action.payload.bhaaiId,
            }),
          );
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
    builder.addCase(revertAll, () => initialState);
    builder.addMatcher(
      baanListApi.endpoints.getBaanList.matchFulfilled,
      (state, {payload}) => {
        const newData = mergeModel<Baan>(Object.values(state).flat(), payload);
        const list: any = {};
        newData.forEach(a => {
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
