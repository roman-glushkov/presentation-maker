import { EditorState, EditorSnapshot } from '../editorSlice';
import { Presentation } from '../types/presentation';

export function pushToPast(state: EditorState, actionType?: string) {
  const SELECTION_ACTIONS = new Set([
    'editor/selectSlide',
    'editor/selectSlides',
    'editor/selectElement',
    'editor/selectMultipleElements',
    'editor/addToSelection',
    'editor/removeFromSelection',
    'editor/clearSelection',
    'editor/clearSlideSelection',
    'editor/clearAllSelections',
  ]);

  if (actionType && SELECTION_ACTIONS.has(actionType)) return;
  if (state.history.transactionDepth > 0) return;

  const snap = makeSnapshot(state);
  state.history.past.push(snap);
  if (state.history.past.length > state.history.maxItems) {
    state.history.past.shift();
  }
  state.history.future = [];
}

export function makeSnapshot(state: EditorState): EditorSnapshot {
  function clonePresentation(p: Presentation): Presentation {
    return JSON.parse(JSON.stringify(p));
  }

  return {
    presentation: clonePresentation(state.presentation),
    selectedSlideId: state.selectedSlideId,
    selectedSlideIds: [...state.selectedSlideIds],
    selectedElementIds: [...state.selectedElementIds],
  };
}

export function undo(state: EditorState) {
  const past = state.history.past;
  if (past.length === 0) return;
  const last = past.pop()!;
  const currentSnap = makeSnapshot(state);
  state.history.future.push(currentSnap);

  function clonePresentation(p: Presentation): Presentation {
    return JSON.parse(JSON.stringify(p));
  }

  state.presentation = clonePresentation(last.presentation);
  state.selectedSlideId = last.selectedSlideId;
  state.selectedSlideIds = [...last.selectedSlideIds];
  state.selectedElementIds = [...last.selectedElementIds];
}

export function redo(state: EditorState) {
  const future = state.history.future;
  if (future.length === 0) return;
  const next = future.pop()!;
  const currentSnap = makeSnapshot(state);
  state.history.past.push(currentSnap);

  function clonePresentation(p: Presentation): Presentation {
    return JSON.parse(JSON.stringify(p));
  }

  state.presentation = clonePresentation(next.presentation);
  state.selectedSlideId = next.selectedSlideId;
  state.selectedSlideIds = [...next.selectedSlideIds];
  state.selectedElementIds = [...next.selectedElementIds];
}
