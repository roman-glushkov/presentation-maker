import { configureStore, Middleware } from '@reduxjs/toolkit';
import editorReducer from './editorSlice';
import toolbarReducer from './toolbarSlice';
const localStorageMiddleware: Middleware = (store) => (next) => (action) => {
  const result = next(action);
  const state = store.getState();

  localStorage.setItem('editorState', JSON.stringify(state.editor));

  return result;
};
const loadState = () => {
  try {
    const serializedState = localStorage.getItem('editorState');
    if (serializedState === null) {
      return undefined;
    }
    const parsedState = JSON.parse(serializedState);
    if (parsedState && typeof parsedState === 'object') {
      return parsedState;
    }

    return undefined;
  } catch (err) {
    console.error(err);
    return undefined;
  }
};

const preloadedState = {
  editor: loadState(),
};

export const store = configureStore({
  preloadedState,
  reducer: {
    editor: editorReducer,
    toolbar: toolbarReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(localStorageMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
