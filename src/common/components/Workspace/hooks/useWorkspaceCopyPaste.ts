// Workspace/hooks/useWorkspaceCopyPaste.ts
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../store';
import { duplicateElements } from '../../../../store/editorSlice';

export default function useWorkspaceCopyPaste() {
  const dispatch = useDispatch();
  const selectedElementIds = useSelector((state: RootState) => state.editor.selectedElementIds);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Проверяем, не редактируется ли текст
      const isTextInputFocused =
        document.activeElement?.tagName === 'INPUT' ||
        document.activeElement?.tagName === 'TEXTAREA' ||
        document.activeElement?.hasAttribute('contenteditable');

      if (isTextInputFocused) return;

      const isCtrl = e.ctrlKey || e.metaKey;
      if (!isCtrl || selectedElementIds.length === 0) return;

      // Используем code для кросс-раскладочной поддержки
      if (e.code === 'KeyC') {
        // Ctrl+C - копирование
        e.preventDefault();
        e.stopPropagation();

        // Сохраняем ID элементов в sessionStorage
        sessionStorage.setItem('elementsClipboard', JSON.stringify(selectedElementIds));
        console.log('Элементы скопированы в буфер:', selectedElementIds);
      }

      if (e.code === 'KeyV') {
        // Ctrl+V - вставка/дублирование
        e.preventDefault();
        e.stopPropagation();

        // Берем ID из буфера или используем выбранные
        const clipboardData = sessionStorage.getItem('elementsClipboard');
        let elementIdsToDuplicate: string[];

        if (clipboardData) {
          elementIdsToDuplicate = JSON.parse(clipboardData);
        } else {
          elementIdsToDuplicate = selectedElementIds;
        }

        if (elementIdsToDuplicate.length > 0) {
          dispatch(duplicateElements({ elementIds: elementIdsToDuplicate }));
        }
      }

      if (e.code === 'KeyD') {
        // Ctrl+D - дублирование
        e.preventDefault();
        e.stopPropagation();

        // Дублируем выбранные элементы
        dispatch(duplicateElements({ elementIds: selectedElementIds }));
      }
    };

    window.addEventListener('keydown', handleKeyDown, { capture: true });
    return () => window.removeEventListener('keydown', handleKeyDown, { capture: true });
  }, [dispatch, selectedElementIds]);
}
