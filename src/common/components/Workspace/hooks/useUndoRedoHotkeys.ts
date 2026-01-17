import { useSelector } from 'react-redux';
import { RootState } from '../../../../store';
import { useKeyboardShortcuts } from '../../../shared/hooks/useKeyboardShortcuts';

export default function useUndoRedoHotkeys() {
  const selectedElementIds = useSelector((state: RootState) => state.editor.selectedElementIds);
  const selectedSlideIds = useSelector((state: RootState) => state.editor.selectedSlideIds);

  useKeyboardShortcuts({
    preview: false,
    selectedElementIds,
    selectedSlideIds,
    context: 'global',
  });
}
