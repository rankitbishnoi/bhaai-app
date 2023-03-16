import {createSlice} from '@reduxjs/toolkit';
import {Appearance} from 'react-native';

export enum themeColor {
  DARK = 'dark',
  LIGHT = 'light',
}

const initialState: {
  mode: themeColor;
} = {
  mode: Appearance.getColorScheme() || themeColor.LIGHT,
} as any;

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    // toggleTheme
    toggleTheme(state) {
      return {
        mode:
          state.mode === themeColor.DARK ? themeColor.LIGHT : themeColor.DARK,
      };
    },
  },
});

export const {toggleTheme} = themeSlice.actions;

export default themeSlice.reducer;
