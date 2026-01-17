import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface ToolbarState {
  activeGroup: string;
  activeTextOption: string | null;
  showTemplates: boolean;
  showTextColorPicker: boolean;
  showFillColorPicker: boolean;
  showBackgroundColorPicker: boolean;
  gridVisible: boolean;
}

const initialState: ToolbarState = {
  activeGroup: 'main',
  activeTextOption: null,
  showTemplates: false,
  showTextColorPicker: false,
  showFillColorPicker: false,
  showBackgroundColorPicker: false,
  gridVisible: false,
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
    toggleGrid(state) {
      state.gridVisible = !state.gridVisible;
    },
    setGridVisible(state, action: PayloadAction<boolean>) {
      state.gridVisible = action.payload;
    },
  },
});

export const { setActiveGroup, setActiveTextOption, toggleGrid, setGridVisible } =
  toolbarSlice.actions;

export default toolbarSlice.reducer;
