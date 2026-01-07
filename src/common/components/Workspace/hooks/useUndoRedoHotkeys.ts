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

      // Проверяем, не находимся ли мы в текстовом поле
      const isTextInputFocused =
        document.activeElement?.tagName === 'INPUT' ||
        document.activeElement?.tagName === 'TEXTAREA' ||
        document.activeElement?.hasAttribute('contenteditable');

      // Если мы в текстовом поле, не перехватываем undo/redo (пусть работает стандартное поведение)
      if (isTextInputFocused) return;

      const key = (e.code || '').toLowerCase();

      if (key === 'keyz' && !e.shiftKey) {
        e.preventDefault();
        e.stopPropagation();
        dispatch(undo());
        return;
      }

      if (key === 'keyy') {
        e.preventDefault();
        e.stopPropagation();
        dispatch(redo());
        return;
      }

      // На Mac также поддерживаем Cmd+Shift+Z для redo
      if (isMac && key === 'keyz' && e.shiftKey) {
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
