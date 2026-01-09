import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../store';
import { removeSlide } from '../../../../store/editorSlice';

export default function useSlidesKeyboard() {
  const dispatch = useDispatch();
  const selectedSlideIds = useSelector((state: RootState) => state.editor.selectedSlideIds);
  const selectedElementIds = useSelector((state: RootState) => state.editor.selectedElementIds);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isTextInputFocused =
        document.activeElement?.tagName === 'INPUT' ||
        document.activeElement?.tagName === 'TEXTAREA' ||
        document.activeElement?.hasAttribute('contenteditable');
      if (isTextInputFocused) return;
      if (
        e.key === 'Delete' &&
        !e.ctrlKey &&
        !e.metaKey &&
        selectedSlideIds.length > 0 &&
        selectedElementIds.length === 0
      ) {
        e.preventDefault();
        e.stopPropagation();
        selectedSlideIds.forEach((slideId: string) => {
          dispatch(removeSlide(slideId));
        });
      }
    };

    window.addEventListener('keydown', handleKeyDown, { capture: true });

    return () => {
      window.removeEventListener('keydown', handleKeyDown, { capture: true });
    };
  }, [dispatch, selectedSlideIds, selectedElementIds]);
}
