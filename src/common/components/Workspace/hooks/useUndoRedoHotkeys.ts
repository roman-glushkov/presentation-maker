import { useEffect } from 'react';
import { useAppDispatch } from '../../../../store/hooks';
import { undo, redo } from '../../../../store/editorSlice';

const isTextInput = (el: Element | null) =>
  el?.tagName === 'INPUT' || el?.tagName === 'TEXTAREA' || el?.hasAttribute('contenteditable');

export default function useUndoRedoHotkeys() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isMac = navigator.platform.toUpperCase().includes('MAC');
      const ctrl = isMac ? e.metaKey : e.ctrlKey;
      if (!ctrl || isTextInput(document.activeElement)) return;

      const key = (e.code || '').toLowerCase();
      const actions: Record<string, () => void> = {
        keyz: () => !e.shiftKey && dispatch(undo()),
        keyy: () => dispatch(redo()),
        ...(isMac && { keyz: () => e.shiftKey && dispatch(redo()) }),
      };

      if (actions[key]) {
        e.preventDefault();
        e.stopPropagation();
        actions[key]();
      }
    };

    window.addEventListener('keydown', handleKeyDown, { capture: true });
    return () => window.removeEventListener('keydown', handleKeyDown, { capture: true });
  }, [dispatch]);
}
