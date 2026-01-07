import { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../store';
import { selectSlide } from '../../../../store/editorSlice';

export default function useSlidesNavigation() {
  const dispatch = useDispatch();
  const slides = useSelector((state: RootState) => state.editor.presentation.slides);
  const selectedSlideId = useSelector((state: RootState) => state.editor.selectedSlideId);

  const isEditingText = useCallback(() => {
    const activeElement = document.activeElement;
    return activeElement?.tagName === 'INPUT' || activeElement?.tagName === 'TEXTAREA';
  }, []);

  const navigateToSlide = useCallback(
    (direction: 'prev' | 'next') => {
      if (isEditingText()) return;

      const currentIndex = slides.findIndex((slide) => slide.id === selectedSlideId);

      if (direction === 'prev' && currentIndex > 0) {
        dispatch(selectSlide(slides[currentIndex - 1].id));
      } else if (direction === 'next' && currentIndex < slides.length - 1) {
        dispatch(selectSlide(slides[currentIndex + 1].id));
      }
    },
    [dispatch, slides, selectedSlideId, isEditingText]
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
        e.preventDefault();
        navigateToSlide('prev');
      } else if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
        e.preventDefault();
        navigateToSlide('next');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigateToSlide]);
}
