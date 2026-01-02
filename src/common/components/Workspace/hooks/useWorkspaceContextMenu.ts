// C:\PGTU\FRONT-end\presentation maker\src\common\components\Workspace\hooks\useWorkspaceContextMenu.ts
import React, { useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../store';
import { ElementActions } from '../utils/elementActions';

export interface MenuState {
  visible: boolean;
  x: number;
  y: number;
}

export interface ContextMenuHandlers {
  menu: MenuState;
  handleContextMenu: (e: React.MouseEvent, slideRect?: DOMRect) => void;
  handleCopy: () => void;
  handlePaste: () => void;
  handleDuplicate: () => void;
  handleDelete: () => void;
  handleBringToFront: () => void;
  handleSendToBack: () => void;
  handleChangeBackground: () => void;
  handleChangeTextColor: () => void;
  handleChangeFill: () => void;
  handleChangeBorderColor: () => void;
  handleChangeBorderWidth: () => void;
  closeMenu: () => void;
}

export default function useWorkspaceContextMenu(): ContextMenuHandlers {
  const [menu, setMenu] = useState<MenuState>({
    visible: false,
    x: 0,
    y: 0,
  });

  const dispatch = useDispatch();
  const selectedElementIds = useSelector((state: RootState) => state.editor.selectedElementIds);
  const selectedSlideIds = useSelector((state: RootState) => state.editor.selectedSlideIds);

  const handleContextMenu = useCallback((e: React.MouseEvent, slideRect?: DOMRect) => {
    e.preventDefault();

    if (slideRect) {
      const { clientX, clientY } = e;
      const { top, bottom, left, right } = slideRect;

      if (clientX >= left && clientX <= right && clientY >= top && clientY <= bottom) {
        setMenu({
          visible: true,
          x: clientX,
          y: clientY,
        });
      }
    } else {
      setMenu({
        visible: true,
        x: e.clientX,
        y: e.clientY,
      });
    }
  }, []);

  // КОПИРОВАТЬ (Ctrl+C)
  const handleCopy = useCallback(() => {
    ElementActions.copy(selectedElementIds);
  }, [selectedElementIds]);

  // ВСТАВИТЬ (Ctrl+V)
  const handlePaste = useCallback(() => {
    ElementActions.paste(selectedElementIds, dispatch);
  }, [dispatch, selectedElementIds]);

  // ДУБЛИРОВАТЬ (Ctrl+D)
  const handleDuplicate = useCallback(() => {
    ElementActions.duplicate(selectedElementIds, dispatch);
  }, [dispatch, selectedElementIds]);

  // УДАЛИТЬ (Delete)
  const handleDelete = useCallback(() => {
    if (selectedElementIds.length > 0) {
      ElementActions.deleteElements(selectedElementIds, dispatch);
    } else if (selectedSlideIds.length > 0) {
      ElementActions.deleteSlides(selectedSlideIds, dispatch);
    }
  }, [dispatch, selectedElementIds, selectedSlideIds]);

  const handleBringToFront = useCallback(() => {
    // Логика перемещения на передний план
  }, []);

  const handleSendToBack = useCallback(() => {
    // Логика перемещения на задний план
  }, []);

  const handleChangeBackground = useCallback(() => {
    // Логика изменения фона
  }, []);

  const handleChangeTextColor = useCallback(() => {
    // Логика изменения цвета текста
  }, []);

  const handleChangeFill = useCallback(() => {
    // Логика изменения заливки
  }, []);

  const handleChangeBorderColor = useCallback(() => {
    // Логика изменения цвета границы
  }, []);

  const handleChangeBorderWidth = useCallback(() => {
    // Логика изменения толщины границы
  }, []);

  const closeMenu = useCallback(() => {
    setMenu({ ...menu, visible: false });
  }, [menu]);

  return {
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
  };
}
