import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../store';
import { handleAction, removeSlide } from '../../../../store/editorSlice';

export default function useWorkspaceKeyboard(preview?: boolean) {
  const dispatch = useDispatch();

  const selectedElementIds = useSelector((state: RootState) => state.editor.selectedElementIds);
  const selectedSlideIds = useSelector((state: RootState) => state.editor.selectedSlideIds);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (preview) return;

      // Удаление выбранных элементов (Delete без модификаторов)
      if (e.key === 'Delete' && !e.ctrlKey && !e.metaKey && selectedElementIds.length > 0) {
        e.preventDefault();
        dispatch(handleAction('DELETE_SELECTED'));
      }

      // Удаление выбранных слайдов (Ctrl+Delete или Cmd+Delete)
      if (e.key === 'Delete' && (e.ctrlKey || e.metaKey) && selectedSlideIds.length > 0) {
        e.preventDefault();

        // Удаляем все выбранные слайды
        selectedSlideIds.forEach((slideId: string) => {
          dispatch(removeSlide(slideId));
        });
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [dispatch, preview, selectedElementIds, selectedSlideIds]);
}
