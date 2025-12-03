import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface ToolbarState {
  activeGroup: string;
  activeTextOption: string | null;
  showTemplates: boolean;
  showTextColorPicker: boolean;
  showFillColorPicker: boolean;
  showBackgroundColorPicker: boolean;
}

const initialState: ToolbarState = {
  activeGroup: 'slides',
  activeTextOption: null,
  showTemplates: false,
  showTextColorPicker: false,
  showFillColorPicker: false,
  showBackgroundColorPicker: false,
};

export const toolbarSlice = createSlice({
  name: 'toolbar',
  initialState,
  reducers: {
    setActiveGroup(state, action: PayloadAction<string>) {
      state.activeGroup = action.payload;
      state.activeTextOption = null;
      state.showTemplates = false;
      state.showTextColorPicker = false;
      state.showFillColorPicker = false;
      state.showBackgroundColorPicker = false;
    },
    setActiveTextOption(state, action: PayloadAction<string | null>) {
      state.activeTextOption = action.payload;
      state.showTemplates = false;
      state.showTextColorPicker = false;
      state.showFillColorPicker = false;
      state.showBackgroundColorPicker = false;
    },
  },
});

export const { setActiveGroup, setActiveTextOption } = toolbarSlice.actions;

export default toolbarSlice.reducer;
