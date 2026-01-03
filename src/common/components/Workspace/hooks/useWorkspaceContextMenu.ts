import React, { useState, useCallback, useMemo } from 'react';
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
  closeMenu: () => void;
  currentColors: {
    slideBackground?: string;
    textColor?: string;
    fillColor?: string;
    borderColor?: string;
  };
  applyColor: (color: string, type: 'text' | 'fill' | 'stroke' | 'background') => void;
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

  const currentSlide = useSelector((state: RootState) =>
    state.editor.presentation.slides.find((s) => s.id === state.editor.selectedSlideId)
  );

  const currentColors = useMemo(() => {
    const colors: {
      slideBackground?: string;
      textColor?: string;
      fillColor?: string;
      borderColor?: string;
    } = {};

    if (currentSlide?.background?.type === 'color') {
      colors.slideBackground = currentSlide.background.value;
    } else {
      colors.slideBackground = '#ffffff';
    }

    if (menu.selectedElement) {
      switch (menu.selectedElement.type) {
        case 'text':
          colors.textColor = menu.selectedElement.color || '#000000';
          colors.fillColor = menu.selectedElement.backgroundColor || 'transparent';
          break;
        case 'shape':
          colors.fillColor = menu.selectedElement.fill || 'transparent';
          colors.borderColor = menu.selectedElement.stroke || '#000000';
          break;
      }
    }

    return colors;
  }, [currentSlide, menu.selectedElement]);

  const handleContextMenu = useCallback(
    (e: React.MouseEvent, element?: SlideElement, isSlideArea?: boolean) => {
      e.preventDefault();

      if (element) {
        dispatch(handleAction(`SELECT_ELEMENT:${element.id}`));
      }

      let targetType: 'text' | 'image' | 'shape' | 'slide' | 'none' = 'none';

      if (isSlideArea) {
        targetType = 'slide';
      } else if (element) {
        targetType = element.type;
      }

      setMenu({
        visible: true,
        x: e.clientX,
        y: e.clientY,
        targetType,
        selectedElement: element ?? null,
      });
    },
    [dispatch]
  );

  const handleCopy = useCallback(() => {
    if (selectedElementIds.length > 0) {
      ElementActions.copy(selectedElementIds);
    }
  }, [selectedElementIds]);

  const handlePaste = useCallback(() => {
    ElementActions.paste(selectedElementIds, dispatch);
  }, [dispatch, selectedElementIds]);

  const handleDuplicate = useCallback(() => {
    if (menu.targetType === 'slide') {
      if (currentSlideId) {
        dispatch(handleAction('DUPLICATE_SLIDE'));
      }
    } else if (selectedElementIds.length > 0) {
      ElementActions.duplicate(selectedElementIds, dispatch);
    }
  }, [dispatch, selectedElementIds, menu.targetType, currentSlideId]);

  const handleDelete = useCallback(() => {
    if (menu.targetType === 'slide') {
      if (currentSlideId) {
        // Удаление слайда можно реализовать здесь
      }
    } else if (selectedElementIds.length > 0) {
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

  const handleChangeBackground = useCallback(() => {}, []);
  const handleChangeTextColor = useCallback(() => {}, []);
  const handleChangeFill = useCallback(() => {}, []);
  const handleChangeBorderColor = useCallback(() => {}, []);

  const applyColor = useCallback(
    (color: string, type: 'text' | 'fill' | 'stroke' | 'background') => {
      const selectedElement =
        menu.selectedElement ??
        (selectedElementIds.length > 0 && currentSlide
          ? currentSlide.elements.find((el) => el.id === selectedElementIds[0])
          : null);

      switch (type) {
        case 'text':
          if (selectedElement?.type === 'text') {
            dispatch(handleAction(`TEXT_COLOR:${color}`));
          }
          break;
        case 'fill':
          if (
            selectedElement &&
            (selectedElement.type === 'text' || selectedElement.type === 'shape')
          ) {
            dispatch(handleAction(`SHAPE_FILL:${color}`));
          }
          break;
        case 'stroke':
          if (selectedElement?.type === 'shape') {
            dispatch(handleAction(`SHAPE_STROKE:${color}`));
          }
          break;
        case 'background':
          if (currentSlideId) {
            dispatch(handleAction(`SLIDE_BACKGROUND:${color}`));
          }
          break;
      }
    },
    [dispatch, selectedElementIds, currentSlide, currentSlideId, menu.selectedElement]
  );

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
    closeMenu,
    currentColors,
    applyColor,
  };
}
