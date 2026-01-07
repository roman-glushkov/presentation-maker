export * from './history';
export * from './text';
export * from './shape';
export * from './slide';
export * from './design';
export * from './order';

import { EditorState } from '../editorSlice';
import { handleTextAction } from './text';
import { handleShapeAction } from './shape';
import { handleSlideAction } from './slide';
import { handleDesignAction } from './design';
import { handleOrderAction } from './order';

export function handleActionDispatcher(state: EditorState, action: string) {
  const elId = state.selectedElementIds[0];

  if (handleDesignAction(state, action)) return 'editor/handleAction/DESIGN_THEME';
  if (handleOrderAction(state, action)) return 'editor/handleAction/ORDER';
  if (handleSlideAction(state, action)) return 'editor/handleAction/SLIDE';
  if (handleShapeAction(state, action, elId)) return 'editor/handleAction/SHAPE';
  if (handleTextAction(state, action, elId)) return 'editor/handleAction/TEXT';
  return null;
}
