import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';

export interface Settings {
  darkMode: boolean;
  localization: boolean; // true: Tiếng Việt, false: English
}

export interface SettingState {
  settings: Settings;
}

const initialState: SettingState = {
  settings: { darkMode: false, localization: false },
};

const settingSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    updateTheme(state, action: PayloadAction<Settings>) {
      state.settings = action.payload;
    },
  },
});

export const { updateTheme } = settingSlice.actions;

// Selectors
export const selectSettings = (state: RootState) => state.settings.settings;

export default settingSlice.reducer;