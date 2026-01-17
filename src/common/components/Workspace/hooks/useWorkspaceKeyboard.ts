import { useSelector } from 'react-redux';
import { RootState } from '../../../../store';
import { useKeyboardShortcuts } from '../../../shared/hooks/useKeyboardShortcuts';

export default function useWorkspaceKeyboard(preview?: boolean) {
  const selectedElementIds = useSelector((state: RootState) => state.editor.selectedElementIds);

  useKeyboardShortcuts({
    preview,
    selectedElementIds,
    context: 'workspace',
  });
}
