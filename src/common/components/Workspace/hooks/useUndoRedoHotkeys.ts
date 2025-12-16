import { useEffect } from 'react';
import { useAppDispatch } from '../../../../store/hooks';
import { undo, redo } from '../../../../store/editorSlice';

export default function useUndoRedoHotkeys() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isMac = navigator.platform.toUpperCase().includes('MAC');
      const ctrl = isMac ? e.metaKey : e.ctrlKey;
      if (!ctrl) return;

      const key = (e.code || '').toLowerCase();

      if (key === 'KeyZ' && !e.shiftKey) {
        e.preventDefault();
        e.stopPropagation();
        dispatch(undo());
        return;
      }

      if (key === 'KeyY') {
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
