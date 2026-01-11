import { useEffect } from 'react';
import { useAppDispatch } from '../../../../store/hooks';
import { undo, redo } from '../../../../store/editorSlice';

const isTextInput = (el: Element | null) =>
  el?.tagName === 'INPUT' || el?.tagName === 'TEXTAREA' || el?.hasAttribute('contenteditable');

// Функция проверки редактирования текста
const isEditingTextElement = (): boolean => {
  const activeElement = document.activeElement;
  if (!activeElement) return false;

  if (activeElement.tagName === 'TEXTAREA' || activeElement.hasAttribute('contenteditable')) {
    return true;
  }

  const closestTextElement = activeElement.closest('.text-edit-area, [data-text-editing="true"]');
  return !!closestTextElement;
};

export default function useUndoRedoHotkeys() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Пропускаем, если редактируется текст
      if (isEditingTextElement()) {
        return;
      }

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
