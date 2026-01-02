import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store';
import { SlideElement } from '../../../store/types/presentation';
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

  const selectedElementIds = useSelector((state: RootState) => state.editor.selectedElementIds);

  const selectedElement = useSelector((state: RootState) => {
    if (selectedElementIds.length === 0) return undefined;

    const currentSlide = state.editor.presentation.slides.find(
      (s) => s.id === state.editor.selectedSlideId
    );

    if (!currentSlide) return undefined;

    return currentSlide.elements.find((el) => el.id === selectedElementIds[0]);
  });

  const {
    menu,
    handleContextMenu,
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

  const handleWorkspaceContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();

    let targetType: 'text' | 'image' | 'shape' | 'slide' | 'none' = 'none';
    let targetElement: SlideElement | undefined = undefined;

    if (selectedElement && selectedElementIds.length > 0) {
      targetElement = selectedElement;
      switch (selectedElement.type) {
        case 'text':
          targetType = 'text';
          break;
        case 'image':
          targetType = 'image';
          break;
        case 'shape':
          targetType = 'shape';
          break;
        default:
          targetType = 'none';
      }
    } else {
      targetType = 'slide';
    }

    handleContextMenu(e, targetElement, targetType === 'slide');
  };

  return (
    <div className="workspace-panel">
      <div className="workspace" onContextMenu={handleWorkspaceContextMenu}>
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
        targetType={menu.targetType}
        selectedElement={menu.selectedElement}
      />
    </div>
  );
}
