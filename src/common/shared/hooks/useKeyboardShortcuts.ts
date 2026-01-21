import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { isTextInputFocused, isEditingTextElement } from './domUtils';
import { ElementActions } from '../../components/Workspace/utils/elementActions';
import { undo, redo, duplicateSlide, removeSlide } from '../../../store/editorSlice';

interface UseKeyboardShortcutsArgs {
  preview?: boolean;
  selectedElementIds?: string[];
  selectedSlideIds?: string[];
  context?: 'workspace' | 'slides' | 'global';
  customActions?: {
    onSelectPrev?: () => void;
    onSelectNext?: () => void;
  };
  enableNavigation?: boolean;
}

export function useKeyboardShortcuts({
  preview,
  selectedElementIds = [],
  selectedSlideIds = [],
  context = 'global',
  customActions,
  enableNavigation = false,
}: UseKeyboardShortcutsArgs) {
  const dispatch = useDispatch();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const handledEvent = e as KeyboardEvent & { _keyboard_shortcut_handled?: boolean };
      if (handledEvent._keyboard_shortcut_handled) return;

      if (preview || isTextInputFocused()) return;

      const isCtrl = e.ctrlKey || e.metaKey;
      const isShift = e.shiftKey;

      if (isCtrl && !isShift && e.code === 'KeyZ' && !isEditingTextElement()) {
        e.preventDefault();
        handledEvent._keyboard_shortcut_handled = true;
        dispatch(undo());
        return;
      }

      if ((isCtrl && e.code === 'KeyY') || (isCtrl && isShift && e.code === 'KeyZ')) {
        e.preventDefault();
        handledEvent._keyboard_shortcut_handled = true;
        dispatch(redo());
        return;
      }

      const hasSelectedElements = selectedElementIds.length > 0;
      const hasSelectedSlides = selectedSlideIds.length > 0;

      if (isCtrl && e.code === 'KeyV' && !isEditingTextElement()) {
        e.preventDefault();
        handledEvent._keyboard_shortcut_handled = true;

        if (hasSelectedSlides) {
          const clipboardData = sessionStorage.getItem('slidesClipboard');
          const slideIds = clipboardData ? JSON.parse(clipboardData) : selectedSlideIds;
          const slideId = slideIds[slideIds.length - 1];
          if (slideId) dispatch(duplicateSlide(slideId));
        } else {
          ElementActions.paste([], dispatch);
        }
        return;
      }

      if (hasSelectedElements && !isEditingTextElement()) {
        handleElementKeys(e, isCtrl);
        if (isCtrl && ['KeyC', 'KeyD'].includes(e.code)) {
          handledEvent._keyboard_shortcut_handled = true;
        }
        return;
      }

      if (hasSelectedSlides) {
        handleSlidesKeys(e, isCtrl);
        if (isCtrl && ['KeyC', 'KeyD'].includes(e.code)) {
          handledEvent._keyboard_shortcut_handled = true;
        }
        return;
      }

      if (enableNavigation && !isEditingTextElement()) {
        switch (e.key) {
          case 'ArrowUp':
          case 'ArrowLeft':
            e.preventDefault();
            customActions?.onSelectPrev?.();
            return;
          case 'ArrowDown':
          case 'ArrowRight':
            e.preventDefault();
            customActions?.onSelectNext?.();
            return;
        }
      }
    };

    const handleElementKeys = (e: KeyboardEvent, isCtrl: boolean) => {
      if (isCtrl) {
        switch (e.code) {
          case 'KeyC':
            if (selectedElementIds.length > 0) {
              e.preventDefault();
              ElementActions.copy(selectedElementIds);
            }
            break;
          case 'KeyD':
            if (selectedElementIds.length > 0) {
              e.preventDefault();
              ElementActions.duplicate(selectedElementIds, dispatch);
            }
            break;
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
            sessionStorage.setItem('slidesClipboard', JSON.stringify(selectedSlideIds));
            break;

          case 'KeyD': {
            e.preventDefault();
            const slideId = selectedSlideIds[selectedSlideIds.length - 1];
            if (slideId) dispatch(duplicateSlide(slideId));
            break;
          }
        }
      } else if (e.key === 'Delete' && selectedSlideIds.length > 0) {
        e.preventDefault();
        selectedSlideIds.forEach((slideId) => dispatch(removeSlide(slideId)));
      }
    };

    window.addEventListener('keydown', handleKeyDown, { capture: true });
    return () => window.removeEventListener('keydown', handleKeyDown, { capture: true });
  }, [
    preview,
    selectedElementIds,
    selectedSlideIds,
    context,
    dispatch,
    customActions,
    enableNavigation,
  ]);
}
