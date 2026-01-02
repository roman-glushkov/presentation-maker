// C:\PGTU\FRONT-end\presentation maker\src\common\components\Workspace\hooks\useWorkspaceContextMenu.ts
import React, { useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../store';
import { SlideElement } from '../../../../store/types/presentation';
import { ElementActions } from '../utils/elementActions';
import { handleAction } from '../../../../store/editorSlice';

export interface MenuState {
  visible: boolean;
  x: number;
  y: number;
  targetType: 'text' | 'image' | 'shape' | 'slide' | 'none';
  selectedElement: SlideElement | null;
}

export interface ContextMenuHandlers {
  menu: MenuState;
  handleContextMenu: (e: React.MouseEvent, element?: SlideElement, isSlideArea?: boolean) => void;
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
    targetType: 'none',
    selectedElement: null,
  });

  const dispatch = useDispatch();
  const selectedElementIds = useSelector((state: RootState) => state.editor.selectedElementIds);

  const currentSlideId = useSelector((state: RootState) => state.editor.selectedSlideId);

  const handleContextMenu = useCallback(
    (e: React.MouseEvent, element?: SlideElement, isSlideArea?: boolean) => {
      e.preventDefault();

      let targetType: 'text' | 'image' | 'shape' | 'slide' | 'none' = 'none';
      let selectedElement: SlideElement | null = null;

      if (isSlideArea) {
        // Клик по области слайда (не по элементу)
        targetType = 'slide';
      } else if (element) {
        // Клик по элементу
        selectedElement = element;
        switch (element.type) {
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
      }

      setMenu({
        visible: true,
        x: e.clientX,
        y: e.clientY,
        targetType,
        selectedElement,
      });
    },
    []
  );

  // КОПИРОВАТЬ (Ctrl+C)
  const handleCopy = useCallback(() => {
    if (selectedElementIds.length > 0) {
      ElementActions.copy(selectedElementIds);
    }
  }, [selectedElementIds]);

  // ВСТАВИТЬ (Ctrl+V)
  const handlePaste = useCallback(() => {
    ElementActions.paste(selectedElementIds, dispatch);
  }, [dispatch, selectedElementIds]);

  // ДУБЛИРОВАТЬ (Ctrl+D)
  const handleDuplicate = useCallback(() => {
    if (menu.targetType === 'slide') {
      // Дублировать слайд
      if (currentSlideId) {
        dispatch(handleAction('DUPLICATE_SLIDE'));
      }
    } else if (selectedElementIds.length > 0) {
      // Дублировать элементы
      ElementActions.duplicate(selectedElementIds, dispatch);
    }
  }, [dispatch, selectedElementIds, menu.targetType, currentSlideId]);

  // УДАЛИТЬ (Delete)
  const handleDelete = useCallback(() => {
    if (menu.targetType === 'slide') {
      // Удалить слайд
      if (currentSlideId) {
        // Нужно импортировать removeSlide или использовать handleAction
        // dispatch(removeSlide(currentSlideId));
        // Или создать action для удаления через handleAction
      }
    } else if (selectedElementIds.length > 0) {
      // Удалить элементы
      ElementActions.deleteElements(selectedElementIds, dispatch);
    }
  }, [dispatch, selectedElementIds, menu.targetType, currentSlideId]);

  const handleBringToFront = useCallback(() => {
    if (selectedElementIds.length > 0) {
      ElementActions.bringToFront(selectedElementIds, dispatch);
    }
  }, [dispatch, selectedElementIds]);

  const handleSendToBack = useCallback(() => {
    if (selectedElementIds.length > 0) {
      ElementActions.sendToBack(selectedElementIds, dispatch);
    }
  }, [dispatch, selectedElementIds]);

  const handleChangeBackground = useCallback(() => {
    if (menu.targetType === 'slide' && currentSlideId) {
      // Здесь можно открыть модалку для выбора цвета фона
      // Пока просто тестовый цвет
      dispatch(handleAction(`SLIDE_BACKGROUND: #f0f0f0`));
    }
  }, [dispatch, menu.targetType, currentSlideId]);

  const handleChangeTextColor = useCallback(() => {
    if (menu.targetType === 'text' && menu.selectedElement?.id) {
      // Здесь можно открыть палитру цветов
      dispatch(handleAction(`TEXT_COLOR: #000000`));
    }
  }, [dispatch, menu.targetType, menu.selectedElement]);

  const handleChangeFill = useCallback(() => {
    if ((menu.targetType === 'text' || menu.targetType === 'shape') && menu.selectedElement?.id) {
      dispatch(handleAction(`SHAPE_FILL: #ffffff`));
    }
  }, [dispatch, menu.targetType, menu.selectedElement]);

  const handleChangeBorderColor = useCallback(() => {
    if (menu.targetType === 'shape' && menu.selectedElement?.id) {
      dispatch(handleAction(`SHAPE_STROKE: #000000`));
    }
  }, [dispatch, menu.targetType, menu.selectedElement]);

  const handleChangeBorderWidth = useCallback(() => {
    if (menu.targetType === 'shape' && menu.selectedElement?.id) {
      dispatch(handleAction(`SHAPE_STROKE_WIDTH: 2`));
    }
  }, [dispatch, menu.targetType, menu.selectedElement]);

  const closeMenu = useCallback(() => {
    setMenu((prev) => ({ ...prev, visible: false }));
  }, []);

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
