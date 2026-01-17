// src/common/shared/hooks/useKeyboardShortcuts.ts
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { isTextInputFocused, isEditingTextElement } from './domUtils';

// Импорты для действий с элементами (замените на реальные пути)
import { ElementActions } from '../../components/Workspace/utils/elementActions'; // Пример пути
import { undo, redo, duplicateSlide, removeSlide } from '../../../store/editorSlice'; // Пример пути

interface UseKeyboardShortcutsArgs {
  preview?: boolean;
  selectedElementIds?: string[];
  selectedSlideIds?: string[];
  context?: 'workspace' | 'slides';
}

export function useKeyboardShortcuts({
  preview,
  selectedElementIds = [],
  selectedSlideIds = [],
  context = 'workspace',
}: UseKeyboardShortcutsArgs) {
  const dispatch = useDispatch();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Общие проверки
      if (preview || isTextInputFocused()) return;

      const isCtrl = e.ctrlKey || e.metaKey;
      const isShift = e.shiftKey;

      // Undo/Redo (общие для всех контекстов)
      if (isCtrl && !isShift && e.code === 'KeyZ' && !isEditingTextElement()) {
        e.preventDefault();
        dispatch(undo());
        return;
      }

      if ((isCtrl && e.code === 'KeyY') || (isCtrl && isShift && e.code === 'KeyZ')) {
        e.preventDefault();
        dispatch(redo());
        return;
      }

      // Контекстные действия
      switch (context) {
        case 'workspace':
          handleWorkspaceKeys(e, isCtrl);
          break;
        case 'slides':
          handleSlidesKeys(e, isCtrl);
          break;
      }
    };

    const handleWorkspaceKeys = (e: KeyboardEvent, isCtrl: boolean) => {
      if (isCtrl && selectedElementIds.length > 0) {
        const keyActions = {
          KeyC: () => ElementActions.copy(selectedElementIds),
          KeyV: () => ElementActions.paste(selectedElementIds, dispatch),
          KeyD: () => ElementActions.duplicate(selectedElementIds, dispatch),
        };

        const action = keyActions[e.code as keyof typeof keyActions];
        if (action) {
          e.preventDefault();
          action();
        }
      }

      if (
        (e.key === 'Delete' || e.key === 'Backspace') &&
        !isCtrl &&
        selectedElementIds.length > 0
      ) {
        e.preventDefault();
        ElementActions.deleteElements(selectedElementIds, dispatch);
      }
    };

    const handleSlidesKeys = (e: KeyboardEvent, isCtrl: boolean) => {
      if (isCtrl) {
        switch (e.code) {
          case 'KeyC':
            e.preventDefault();
            // Логика copySlides из useSlidesActions.ts
            if (selectedSlideIds.length === 0) return;
            sessionStorage.setItem('slidesClipboard', JSON.stringify(selectedSlideIds));
            break;
          case 'KeyV': {
            e.preventDefault();
            // Логика pasteSlides из useSlidesActions.ts
            const clipboardData = sessionStorage.getItem('slidesClipboard');
            let slideIdToDuplicate;

            if (clipboardData) {
              const slideIds = JSON.parse(clipboardData);
              slideIdToDuplicate = slideIds[slideIds.length - 1];
            } else {
              slideIdToDuplicate = selectedSlideIds[selectedSlideIds.length - 1];
            }

            if (slideIdToDuplicate) {
              dispatch(duplicateSlide(slideIdToDuplicate));
            }
            break;
          }
          case 'KeyD': {
            e.preventDefault();
            // Логика duplicateSlides из useSlidesActions.ts
            const lastSelectedId = selectedSlideIds[selectedSlideIds.length - 1];
            if (lastSelectedId) {
              dispatch(duplicateSlide(lastSelectedId));
            }
            break;
          }
        }
      } else if (e.key === 'Delete' && selectedSlideIds.length > 0) {
        e.preventDefault();
        // Логика deleteSlides из useSlidesActions.ts
        selectedSlideIds.forEach((slideId: string) => {
          dispatch(removeSlide(slideId));
        });
      }
    };

    window.addEventListener('keydown', handleKeyDown, { capture: true });
    return () => window.removeEventListener('keydown', handleKeyDown, { capture: true });
  }, [preview, selectedElementIds, selectedSlideIds, context, dispatch]);
}
