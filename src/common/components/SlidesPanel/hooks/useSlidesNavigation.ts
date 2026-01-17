import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../store';
import { selectSlide } from '../../../../store/editorSlice';
import { useKeyboardShortcuts } from '../../../shared/hooks/useKeyboardShortcuts';

export default function useSlidesNavigation() {
  const dispatch = useDispatch();
  const slides = useSelector((state: RootState) => state.editor.presentation.slides);
  const selectedSlideId = useSelector((state: RootState) => state.editor.selectedSlideId);
  const selectedElementIds = useSelector((state: RootState) => state.editor.selectedElementIds);

  const navigateToSlide = useCallback(
    (direction: 'prev' | 'next') => {
      const currentIndex = slides.findIndex((slide) => slide.id === selectedSlideId);

      if (direction === 'prev' && currentIndex > 0) {
        dispatch(selectSlide(slides[currentIndex - 1].id));
      } else if (direction === 'next' && currentIndex < slides.length - 1) {
        dispatch(selectSlide(slides[currentIndex + 1].id));
      }
    },
    [dispatch, slides, selectedSlideId]
  );

  // Используем общий хук для горячих клавиш с кастомными действиями
  useKeyboardShortcuts({
    preview: false,
    selectedElementIds,
    context: 'global',
    customActions: {
      onSelectPrev: () => navigateToSlide('prev'),
      onSelectNext: () => navigateToSlide('next'),
    },
    enableNavigation: true,
  });

  // Возвращаем функцию навигации если нужна где-то еще
  return { navigateToSlide };
}
