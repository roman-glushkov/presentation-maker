import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../store';
import { ElementActions } from '../utils/elementActions';
import { AppDispatch } from '../../../../store';

const isTextInput = (el: Element | null) =>
  el?.tagName === 'INPUT' || el?.tagName === 'TEXTAREA' || el?.hasAttribute('contenteditable');

// Улучшенная функция проверки редактирования текста
const isEditingTextElement = (): boolean => {
  const activeElement = document.activeElement;
  if (!activeElement) return false;

  // Проверяем все возможные варианты текстовых редакторов
  if (activeElement.tagName === 'TEXTAREA') {
    return true;
  }

  if (activeElement.hasAttribute('contenteditable')) {
    return true;
  }

  // Проверяем, находится ли в текстовом элементе
  const closestTextElement = activeElement.closest('.text-edit-area, [data-text-editing="true"]');
  if (closestTextElement) {
    return true;
  }

  return false;
};

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
      // Пропускаем ВСЕ события стрелок и клавиш редактирования текста
      const textEditingKeys = [
        'ArrowLeft',
        'ArrowRight',
        'ArrowUp',
        'ArrowDown',
        'Home',
        'End',
        'PageUp',
        'PageDown',
        'Backspace',
        'Delete',
        'Enter',
      ];

      // Если пользователь редактирует текст ИЛИ нажата стрелка/клавиша редактирования
      if (isEditingTextElement() && textEditingKeys.includes(e.key)) {
        return; // Пропускаем событие полностью
      }

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

    window.addEventListener('keydown', handleKeyDown, { capture: false }); // Используем bubbling, не capture
    return () => window.removeEventListener('keydown', handleKeyDown, { capture: false });
  }, [dispatch, preview, selectedElementIds]);
}
