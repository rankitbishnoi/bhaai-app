import {createSlice, PayloadAction} from '@reduxjs/toolkit';

import {Nimta, Nimta1} from '../../../types/Nimta';
import {NimtaList} from '../../../types/NimtaList';
import {ApiSlice} from '../api-slice';
import {revertAll} from '../actions/revertAll';
import {AddRelative} from '../../../types/AddRelative';

const initialState: Nimta[] = [];

export const nimtaListApi = ApiSlice.injectEndpoints({
  endpoints: builder => ({
    getNimtaList: builder.query<NimtaList, string>({
      query: pariwarId => ({
        url: `pariwar/${pariwarId}/nimta`,
        method: 'GET',
      }),
      providesTags: ['Nimta'],
    }),
    createNimta: builder.mutation<Nimta, {pariwarId: string; body: Nimta1}>({
      query: data => ({
        url: `pariwar/${data.pariwarId}/nimta`,
        method: 'POST',
        body: data.body,
      }),
      invalidatesTags: ['Nimta'],
    }),
    updatedNimta: builder.mutation<Nimta, {pariwarId: string; body: Nimta1}>({
      query: data => ({
        url: `pariwar/${data.pariwarId}/nimta/${data.body._id}`,
        method: 'PUT',
        body: data.body,
      }),
      invalidatesTags: ['Nimta'],
    }),
    deleteNimta: builder.mutation<Nimta, {pariwarId: string; id: string}>({
      query: data => ({
        url: `pariwar/${data.pariwarId}/nimta/${data.id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Nimta'],
    }),
    addBaanAndRelativeInNimta: builder.mutation<
      void,
      {pariwarId: string; id: string; body: AddRelative}
    >({
      query: data => ({
        url: `pariwar/${data.pariwarId}/nimta/${data.id}/addRelative`,
        method: 'POST',
        body: data.body,
      }),
      invalidatesTags: ['Nimta', 'Relative'],
    }),
    removeRelativeFromNimta: builder.mutation<
      void,
      {pariwarId: string; id: string; nimtaId: string}
    >({
      query: data => ({
        url: `pariwar/${data.pariwarId}/nimta/${data.nimtaId}/removeRelative/${data.id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Nimta'],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetNimtaListQuery,
  useCreateNimtaMutation,
  useDeleteNimtaMutation,
  useUpdatedNimtaMutation,
} = nimtaListApi;

const nimtaSlice = createSlice({
  name: 'nimtaList',
  initialState,
  reducers: {
    // createNimta
    createdNimta(
      state,
      action: PayloadAction<{pariwarId: string; body: Nimta1}>,
    ) {
      state.push({
        ...action.payload.body,
        relative: [],
      });
    },
    // updateNimta
    updatedNimta(
      state,
      action: PayloadAction<{pariwarId: string; body: Nimta1}>,
    ) {
      const foundIndex = state.findIndex(
        a => a._id === action.payload.body._id,
      );
      if (foundIndex > -1) {
        state.splice(foundIndex, 1, {
          ...action.payload.body,
          relative: state[foundIndex].relative,
        });
      }
    },
    // deleteNimta
    deletedNimta(
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
      nimtaListApi.endpoints.getNimtaList.matchFulfilled,
      (_state, {payload}) => {
        return payload;
      },
    );
  },
});

export const {createdNimta, deletedNimta, updatedNimta} = nimtaSlice.actions;

export default nimtaSlice.reducer;
