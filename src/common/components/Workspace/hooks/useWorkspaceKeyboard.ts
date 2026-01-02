// C:\PGTU\FRONT-end\presentation maker\src\common\components\Workspace\hooks\useWorkspaceKeyboard.ts
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../store';
import { ElementActions } from '../utils/elementActions';

export default function useWorkspaceKeyboard(preview?: boolean) {
  const dispatch = useDispatch();

  const selectedElementIds = useSelector((state: RootState) => state.editor.selectedElementIds);
  const selectedSlideIds = useSelector((state: RootState) => state.editor.selectedSlideIds);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (preview) return;

      const isCtrl = e.ctrlKey || e.metaKey;
      const isTextInputFocused =
        document.activeElement?.tagName === 'INPUT' ||
        document.activeElement?.tagName === 'TEXTAREA' ||
        document.activeElement?.hasAttribute('contenteditable');

      if (isTextInputFocused) return;

      // Ctrl+X - ВЫРЕЗАТЬ
      if (isCtrl && e.key === 'x' && selectedElementIds.length > 0) {
        e.preventDefault();
        ElementActions.cut(selectedElementIds, dispatch);
      }

      // Ctrl+C - КОПИРОВАТЬ
      if (isCtrl && e.key === 'c' && selectedElementIds.length > 0) {
        e.preventDefault();
        ElementActions.copy(selectedElementIds);
      }

      // Ctrl+V - ВСТАВИТЬ
      if (isCtrl && e.key === 'v') {
        e.preventDefault();
        ElementActions.paste(selectedElementIds, dispatch);
      }

      // Ctrl+D - ДУБЛИРОВАТЬ
      if (isCtrl && e.key === 'd' && selectedElementIds.length > 0) {
        e.preventDefault();
        ElementActions.duplicate(selectedElementIds, dispatch);
      }

      // Delete - УДАЛИТЬ ЭЛЕМЕНТЫ
      if (e.key === 'Delete' && !isCtrl && selectedElementIds.length > 0) {
        e.preventDefault();
        ElementActions.deleteElements(selectedElementIds, dispatch);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [dispatch, preview, selectedElementIds, selectedSlideIds]);
}
