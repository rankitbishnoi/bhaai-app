import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';

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
    getProfile: builder.query<Profile, void>({
      query: () => ({
        url: 'profile',
        method: 'GET',
      }),
      providesTags: ['Profile'],
    }),
  }),
  overrideExisting: false,
});

export const {useGetProfileQuery} = profileApi;

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
        console.log('state, {payload}', {payload});
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
