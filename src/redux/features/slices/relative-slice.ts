import {createSlice, PayloadAction} from '@reduxjs/toolkit';

import {Relative} from '../../../types/Relative';
import {RelativeList} from '../../../types/RelativeList';
import {ApiSlice} from '../api-slice';
import {revertAll} from '../actions/revertAll';

const initialState: Relative[] = [];

export const relativeListApi = ApiSlice.injectEndpoints({
  endpoints: builder => ({
    getRelativeList: builder.query<RelativeList, string>({
      query: pariwarId => ({
        url: `pariwar/${pariwarId}/relative`,
        method: 'GET',
      }),
      providesTags: ['Relative'],
    }),
    createRelative: builder.mutation<
      Relative,
      {pariwarId: string; body: Relative}
    >({
      query: data => ({
        url: `pariwar/${data.pariwarId}/relative`,
        method: 'POST',
        body: data.body,
      }),
      invalidatesTags: ['Relative'],
    }),
    updatedRelative: builder.mutation<
      Relative,
      {pariwarId: string; body: Relative}
    >({
      query: data => ({
        url: `pariwar/${data.pariwarId}/relative/${data.body._id}`,
        method: 'PUT',
        body: data.body,
      }),
      invalidatesTags: ['Relative'],
    }),
    deleteRelative: builder.mutation<Relative, {pariwarId: string; id: string}>(
      {
        query: data => ({
          url: `pariwar/${data.pariwarId}/relative/${data.id}`,
          method: 'DELETE',
        }),
        invalidatesTags: ['Relative'],
      },
    ),
  }),
  overrideExisting: false,
});

export const {
  useGetRelativeListQuery,
  useCreateRelativeMutation,
  useDeleteRelativeMutation,
  useUpdatedRelativeMutation,
} = relativeListApi;

const relativeSlice = createSlice({
  name: 'relativeList',
  initialState,
  reducers: {
    // createRelative
    createdRelative(
      state,
      action: PayloadAction<{pariwarId: string; body: Relative}>,
    ) {
      state.push(action.payload.body);
    },
    // updateRelative
    updatedRelative(
      state,
      action: PayloadAction<{pariwarId: string; body: Relative}>,
    ) {
      const foundIndex = state.findIndex(
        a => a._id === action.payload.body._id,
      );
      if (foundIndex > -1) {
        state.splice(foundIndex, 1, action.payload.body);
      }
    },
    // deleteRelative
    deletedRelative(
      state,
      action: PayloadAction<{pariwarId: string; id: string}>,
    ) {
      const foundIndex = state.findIndex(a => a._id === action.payload.id);
      if (foundIndex > -1) {
        state.splice(foundIndex, 1);
      }
    },
  },
  extraReducers: builder => {
    builder.addCase(revertAll, () => initialState);
    builder.addMatcher(
      relativeListApi.endpoints.getRelativeList.matchFulfilled,
      (_state, {payload}) => {
        return payload;
      },
    );
  },
});

export const {createdRelative, deletedRelative, updatedRelative} =
  relativeSlice.actions;

export default relativeSlice.reducer;
