import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../store';
import { ElementActions } from '../utils/elementActions';
import { AppDispatch } from '../../../../store';

const isTextInput = (el: Element | null) =>
  el?.tagName === 'INPUT' || el?.tagName === 'TEXTAREA' || el?.hasAttribute('contenteditable');

const keyActions: Record<string, (dispatch: AppDispatch, selectedElementIds: string[]) => void> = {
  KeyC: (dispatch, selectedElementIds) => ElementActions.copy(selectedElementIds),
  KeyV: (dispatch, selectedElementIds) => ElementActions.paste(selectedElementIds, dispatch),
  KeyD: (dispatch, selectedElementIds) => ElementActions.duplicate(selectedElementIds, dispatch),
};

export default function useWorkspaceKeyboard(preview?: boolean) {
  const dispatch = useDispatch<AppDispatch>();
  const selectedElementIds = useSelector((state: RootState) => state.editor.selectedElementIds);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (preview || isTextInput(document.activeElement)) return;

      const isCtrl = e.ctrlKey || e.metaKey;
      const keyAction = keyActions[e.code];

      if (isCtrl && keyAction && selectedElementIds.length > 0) {
        e.preventDefault();
        e.stopPropagation();
        keyAction(dispatch, selectedElementIds);
      }

      if (
        (e.key === 'Delete' || e.key === 'Backspace') &&
        !isCtrl &&
        selectedElementIds.length > 0
      ) {
        e.preventDefault();
        e.stopPropagation();
        ElementActions.deleteElements(selectedElementIds, dispatch);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [dispatch, preview, selectedElementIds]);
}
