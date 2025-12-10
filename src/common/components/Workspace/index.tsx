import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store';
import './styles.css';

import WorkspaceContent from './parts/WorkspaceContent';
import useWorkspaceKeyboard from './hooks/useWorkspaceKeyboard';
import useWorkspaceCopyPaste from './hooks/useWorkspaceCopyPaste';

interface Props {
  preview?: boolean;
}

export default function Workspace({ preview }: Props) {
  const slide = useSelector((state: RootState) =>
    state.editor.presentation.slides.find((s) => s.id === state.editor.selectedSlideId)
  );

  useWorkspaceKeyboard(preview);
  useWorkspaceCopyPaste();

  return (
    <div className="workspace-panel">
      <div className="workspace">
        {slide ? (
          <WorkspaceContent slide={slide} preview={preview} />
        ) : (
          <div className="no-slide-selected">
            <p>Выберите слайд</p>
          </div>
        )}
      </div>
    </div>
  );
}
