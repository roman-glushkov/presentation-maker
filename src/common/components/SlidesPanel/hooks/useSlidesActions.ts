import { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../store';
import { duplicateSlide, removeSlide } from '../../../../store/editorSlice';

export default function useSlidesActions() {
  const dispatch = useDispatch();
  const selectedSlideIds = useSelector((state: RootState) => state.editor.selectedSlideIds);
  const selectedElementIds = useSelector((state: RootState) => state.editor.selectedElementIds);

  const isTextInputFocused = useCallback(() => {
    const activeElement = document.activeElement;
    return (
      activeElement?.tagName === 'INPUT' ||
      activeElement?.tagName === 'TEXTAREA' ||
      activeElement?.hasAttribute('contenteditable')
    );
  }, []);

  const copySlides = useCallback(() => {
    if (selectedSlideIds.length === 0) return;
    sessionStorage.setItem('slidesClipboard', JSON.stringify(selectedSlideIds));
  }, [selectedSlideIds]);

  const pasteSlides = useCallback(() => {
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
  }, [dispatch, selectedSlideIds]);

  const deleteSlides = useCallback(() => {
    if (selectedSlideIds.length === 0 || selectedElementIds.length > 0) return;

    selectedSlideIds.forEach((slideId: string) => {
      dispatch(removeSlide(slideId));
    });
  }, [dispatch, selectedSlideIds, selectedElementIds]);

  const duplicateSlides = useCallback(() => {
    const lastSelectedId = selectedSlideIds[selectedSlideIds.length - 1];
    if (lastSelectedId) {
      dispatch(duplicateSlide(lastSelectedId));
    }
  }, [dispatch, selectedSlideIds]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isTextInputFocused()) return;

      const isCtrl = e.ctrlKey || e.metaKey;

      if (isCtrl) {
        switch (e.code) {
          case 'KeyC':
            e.preventDefault();
            copySlides();
            break;
          case 'KeyV':
            e.preventDefault();
            pasteSlides();
            break;
          case 'KeyD':
            e.preventDefault();
            duplicateSlides();
            break;
        }
      } else if (e.key === 'Delete') {
        e.preventDefault();
        deleteSlides();
      }
    };

    window.addEventListener('keydown', handleKeyDown, { capture: true });
    return () => window.removeEventListener('keydown', handleKeyDown, { capture: true });
  }, [isTextInputFocused, copySlides, pasteSlides, deleteSlides, duplicateSlides]);

  return {
    copySlides,
    pasteSlides,
    deleteSlides,
    duplicateSlides,
  };
}
