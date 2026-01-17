import { useSelector } from 'react-redux';
import { RootState } from '../../../../store';
import { useKeyboardShortcuts } from '../../../shared/hooks/useKeyboardShortcuts';

export default function useUndoRedoHotkeys() {
  const selectedElementIds = useSelector((state: RootState) => state.editor.selectedElementIds);
  const selectedSlideIds = useSelector((state: RootState) => state.editor.selectedSlideIds);

  // Используем общий хук для горячих клавиш с контекстом 'global'
  useKeyboardShortcuts({
    preview: false,
    selectedElementIds,
    selectedSlideIds,
    context: 'global', // Undo/Redo доступны везде
  });
}
