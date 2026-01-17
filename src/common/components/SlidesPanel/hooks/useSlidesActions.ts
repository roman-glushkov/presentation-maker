import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../store';
import { duplicateSlide, removeSlide } from '../../../../store/editorSlice';
import { useKeyboardShortcuts } from '../../../shared/hooks/useKeyboardShortcuts';

export default function useSlidesActions() {
  const dispatch = useDispatch();
  const selectedSlideIds = useSelector((state: RootState) => state.editor.selectedSlideIds);
  const selectedElementIds = useSelector((state: RootState) => state.editor.selectedElementIds);

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

  // Используем общий хук для горячих клавиш
  useKeyboardShortcuts({
    preview: false,
    selectedSlideIds,
    context: 'slides',
    // customActions не нужны, так как логика уже встроена в useKeyboardShortcuts
  });

  return {
    copySlides,
    pasteSlides,
    deleteSlides,
    duplicateSlides,
  };
}
