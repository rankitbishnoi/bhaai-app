import {createSlice, PayloadAction} from '@reduxjs/toolkit';

import {Relative} from '../../../types/Relative';
import {RelativeList} from '../../../types/RelativeList';
import {ApiSlice} from '../api-slice';
import {revertAll} from '../actions/revertAll';
import {createModel, mergeModel, Model} from '../helper';

const initialState: Record<string, Model<Relative>[]> = {};

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
      const list = state[action.payload.pariwarId];
      if (list) {
        list.push(createModel<Relative>(action.payload.body));
      }
    },
    // updateRelative
    updatedRelative(
      state,
      action: PayloadAction<{pariwarId: string; body: Relative}>,
    ) {
      const list = state[action.payload.pariwarId];
      if (list) {
        const foundIndex = list.findIndex(
          a => a._id === action.payload.body._id,
        );
        if (foundIndex > -1) {
          list.splice(
            foundIndex,
            1,
            createModel<Relative>({
              ...action.payload.body,
              pariwarId: action.payload.pariwarId,
            }),
          );
        }
      }
    },
    // deleteRelative
    deletedRelative(
      state,
      action: PayloadAction<{pariwarId: string; id: string}>,
    ) {
      const list = state[action.payload.pariwarId];
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
      relativeListApi.endpoints.getRelativeList.matchFulfilled,
      (state, {payload, meta}) => {
        const newData = mergeModel<Relative>(
          state[meta.arg.originalArgs] || [],
          payload,
        );
        const list: any = {};
        [
          ...newData,
          ...Object.keys(state)
            .filter(id => id !== meta.arg.originalArgs)
            .map(id => state[id])
            .flat(),
        ].forEach(a => {
          if (!a.pariwarId) {
            return;
          }

          if (list[a.pariwarId]) {
            list[a.pariwarId].push(a);
          } else {
            list[a.pariwarId] = [a];
          }
        });
        return list;
      },
    );
  },
});

export const {createdRelative, deletedRelative, updatedRelative} =
  relativeSlice.actions;

export default relativeSlice.reducer;
