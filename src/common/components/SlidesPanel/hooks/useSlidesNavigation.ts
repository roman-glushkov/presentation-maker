import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../store';
import { selectSlide } from '../../../../store/editorSlice';

export default function useSlidesNavigation() {
  const dispatch = useDispatch();
  const slides = useSelector((state: RootState) => state.editor.presentation.slides);
  const selectedSlideId = useSelector((state: RootState) => state.editor.selectedSlideId);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Переключение между слайдами стрелками (только когда не редактируется текст)
      const isEditingText =
        document.activeElement?.tagName === 'INPUT' ||
        document.activeElement?.tagName === 'TEXTAREA';

      if (isEditingText) return;

      const currentIndex = slides.findIndex((slide) => slide.id === selectedSlideId);

      if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
        e.preventDefault();
        if (currentIndex > 0) {
          dispatch(selectSlide(slides[currentIndex - 1].id));
        }
      } else if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
        e.preventDefault();
        if (currentIndex < slides.length - 1) {
          dispatch(selectSlide(slides[currentIndex + 1].id));
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [dispatch, slides, selectedSlideId]);
}
