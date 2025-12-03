import { configureStore } from '@reduxjs/toolkit';
import editorReducer from './editorSlice';
import toolbarReducer from './toolbarSlice';

export const store = configureStore({
  reducer: {
    editor: editorReducer,
    toolbar: toolbarReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
