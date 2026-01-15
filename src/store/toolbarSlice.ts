import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface ToolbarState {
  activeGroup: string;
  activeTextOption: string | null;
  showTemplates: boolean;
  showTextColorPicker: boolean;
  showFillColorPicker: boolean;
  showBackgroundColorPicker: boolean;
  gridVisible: boolean; // Добавляем состояние сетки
}

const initialState: ToolbarState = {
  activeGroup: 'main',
  activeTextOption: null,
  showTemplates: false,
  showTextColorPicker: false,
  showFillColorPicker: false,
  showBackgroundColorPicker: false,
  gridVisible: false, // По умолчанию сетка скрыта
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
    // Добавляем action для переключения сетки
    toggleGrid(state) {
      state.gridVisible = !state.gridVisible;
    },
    // Можно также добавить action для явной установки состояния
    setGridVisible(state, action: PayloadAction<boolean>) {
      state.gridVisible = action.payload;
    },
  },
});

// Экспортируем новые actions
export const { setActiveGroup, setActiveTextOption, toggleGrid, setGridVisible } =
  toolbarSlice.actions;

export default toolbarSlice.reducer;
