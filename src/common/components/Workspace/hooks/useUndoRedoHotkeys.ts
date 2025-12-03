// src/common/components/Workspace/hooks/useUndoRedoHotkeys.ts
import { useEffect } from 'react';
import { useAppDispatch } from '../../../../store/hooks';
import { undo, redo } from '../../../../store/editorSlice';

export default function useUndoRedoHotkeys() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // поддержка mac и windows, русская раскладка
      const isMac = navigator.platform.toUpperCase().includes('MAC');
      const ctrl = isMac ? e.metaKey : e.ctrlKey;
      if (!ctrl) return;

      const key = (e.key || '').toLowerCase();

      // Undo: Ctrl+Z / Ctrl+Я (без shift)
      if ((key === 'z' || key === 'я') && !e.shiftKey) {
        e.preventDefault();
        e.stopPropagation();
        dispatch(undo());
        return;
      }

      // Redo:
      // - Ctrl+Y (EN)
      // - Ctrl+Н (RU)
      if (key === 'y' || key === 'н') {
        e.preventDefault();
        e.stopPropagation();
        dispatch(redo());
        return;
      }
    };

    window.addEventListener('keydown', handleKeyDown, { capture: true });
    return () => window.removeEventListener('keydown', handleKeyDown, { capture: true });
  }, [dispatch]);
}
