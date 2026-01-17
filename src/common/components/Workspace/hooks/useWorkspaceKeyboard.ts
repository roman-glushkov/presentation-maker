import { useSelector } from 'react-redux';
import { RootState } from '../../../../store';
import { useKeyboardShortcuts } from '../../../shared/hooks/useKeyboardShortcuts';

export default function useWorkspaceKeyboard(preview?: boolean) {
  const selectedElementIds = useSelector((state: RootState) => state.editor.selectedElementIds);

  // Используем общий хук для горячих клавиш
  useKeyboardShortcuts({
    preview,
    selectedElementIds,
    context: 'workspace',
  });
}
