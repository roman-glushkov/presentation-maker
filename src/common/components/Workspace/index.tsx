// C:\PGTU\FRONT-end\presentation maker\src\common\components\Workspace\index.tsx
import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store';
import './styles.css';

import WorkspaceContent from './parts/WorkspaceContent';
import WorkspaceContextMenu from './parts/WorkspaceContextMenu';
import useWorkspaceKeyboard from './hooks/useWorkspaceKeyboard';
import useWorkspaceContextMenu from './hooks/useWorkspaceContextMenu';

interface Props {
  preview?: boolean;
}

export default function Workspace({ preview }: Props) {
  const slide = useSelector((state: RootState) =>
    state.editor.presentation.slides.find((s) => s.id === state.editor.selectedSlideId)
  );

  const {
    menu,
    handleContextMenu,
    handleCut,
    handleCopy,
    handlePaste,
    handleDuplicate,
    handleDelete,
    handleBringToFront,
    handleSendToBack,
    handleChangeBackground,
    handleChangeTextColor,
    handleChangeFill,
    handleChangeBorderColor,
    handleChangeBorderWidth,
    closeMenu,
  } = useWorkspaceContextMenu();

  useWorkspaceKeyboard(preview);

  return (
    <div className="workspace-panel">
      <div
        className="workspace"
        onContextMenu={(e) => {
          const slideElement = e.currentTarget.querySelector('.slide-container') as HTMLElement;
          const slideRect = slideElement?.getBoundingClientRect();
          handleContextMenu(e, slideRect);
        }}
      >
        {slide ? (
          <WorkspaceContent slide={slide} preview={preview} />
        ) : (
          <div className="no-slide-selected">
            <p>Выберите слайд</p>
          </div>
        )}
      </div>

      <WorkspaceContextMenu
        visible={menu.visible}
        x={menu.x}
        y={menu.y}
        slideAreaHeight={600}
        onClose={closeMenu}
        onCut={handleCut}
        onCopy={handleCopy}
        onPaste={handlePaste}
        onDuplicate={handleDuplicate}
        onDelete={handleDelete}
        onBringToFront={handleBringToFront}
        onSendToBack={handleSendToBack}
        onChangeBackground={handleChangeBackground}
        onChangeTextColor={handleChangeTextColor}
        onChangeFill={handleChangeFill}
        onChangeBorderColor={handleChangeBorderColor}
        onChangeBorderWidth={handleChangeBorderWidth}
      />
    </div>
  );
}
