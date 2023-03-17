import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';
import {Pariwar} from '../../../types/Pariwar';

import {Profile} from '../../../types/Profile';
import {revertAll} from '../actions/revertAll';
import {ApiSlice} from '../api-slice';

export const logoutthunk = createAsyncThunk(
  'LOGOUT_ACTION',
  async (_, {dispatch}) => {
    dispatch(logout());
    dispatch(revertAll());
    dispatch(ApiSlice.util.resetApiState());
  },
);

export const loginthunk = createAsyncThunk(
  'LOGIN_ACTION',
  async (token: string, {dispatch}) => {
    dispatch(login(token));
    dispatch(profileApi.endpoints.getProfile.initiate(token));
  },
);

const initialState: {
  user: Profile;
  isLoggedIn: boolean;
  token: string | null;
  selectedPariwar: string | null;
} = {
  isLoggedIn: false,
  selectedPariwar: null,
} as any;

export const profileApi = ApiSlice.injectEndpoints({
  endpoints: builder => ({
    getProfile: builder.query<Profile, void | string>({
      query: token => ({
        url: 'profile',
        method: 'GET',
        headers: token
          ? {
              authorization: `Bearer ${token}`,
            }
          : undefined,
      }),
      providesTags: ['Profile'],
    }),
    createPariwar: builder.mutation<Pariwar, Pariwar>({
      query: body => ({
        url: 'pariwar',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Profile'],
    }),
    updatedPariwar: builder.mutation<Pariwar, Pariwar>({
      query: body => ({
        url: `pariwar/${body._id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['Profile'],
    }),
    deletePariwar: builder.mutation<Pariwar, string>({
      query: id => ({
        url: `pariwar/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Profile'],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetProfileQuery,
  useCreatePariwarMutation,
  useDeletePariwarMutation,
  useUpdatedPariwarMutation,
} = profileApi;

const pariwarSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    // login
    login(state, action: PayloadAction<string>) {
      return {
        ...state,
        isLoggedIn: true,
        token: action.payload,
      };
    },
    // logout
    logout(state) {
      return {
        ...state,
        isLoggedIn: false,
        token: null,
      };
    },
    // updateProfile
    updatedProfile(state, action: PayloadAction<Profile>) {
      return {
        ...state,
        user: action.payload,
      };
    },
    // select pariwar
    selectPariwar(state, action: PayloadAction<string>) {
      return {
        ...state,
        selectedPariwar: action.payload,
      };
    },
  },
  extraReducers: builder => {
    builder.addCase(revertAll, () => initialState);
    builder.addMatcher(
      profileApi.endpoints.getProfile.matchFulfilled,
      (state, {payload}) => {
        return {
          ...state,
          user: payload,
        };
      },
    );
  },
});

export const {updatedProfile, login, logout, selectPariwar} =
  pariwarSlice.actions;

export default pariwarSlice.reducer;
