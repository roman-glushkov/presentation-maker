import React, { useState, useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../store';
import { SlideElement } from '../../../../store/types/presentation';
import { ElementActions } from '../utils/elementActions';
import { handleAction } from '../../../../store/editorSlice';
import { AppDispatch } from '../../../../store';

type ColorType = 'text' | 'fill' | 'stroke' | 'background';
type TargetType = 'text' | 'image' | 'shape' | 'slide' | 'none';

interface MenuState {
  visible: boolean;
  x: number;
  y: number;
  targetType: TargetType;
  selectedElement: SlideElement | null;
}

interface ContextMenuHandlers {
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
  currentColors: Record<string, string>;
  applyColor: (color: string, type: ColorType) => void;
}

export default function useWorkspaceContextMenu(): ContextMenuHandlers {
  const [menu, setMenu] = useState<MenuState>({
    visible: false,
    x: 0,
    y: 0,
    targetType: 'none',
    selectedElement: null,
  });

  const dispatch = useDispatch<AppDispatch>();
  const selectedElementIds = useSelector((state: RootState) => state.editor.selectedElementIds);
  const currentSlideId = useSelector((state: RootState) => state.editor.selectedSlideId);
  const currentSlide = useSelector((state: RootState) =>
    state.editor.presentation.slides.find((s) => s.id === state.editor.selectedSlideId)
  );

  const currentColors = useMemo(() => {
    const colors: Record<string, string> = { slideBackground: '#ffffff' };

    if (currentSlide?.background?.type === 'color') {
      colors.slideBackground = currentSlide.background.value;
    }

    if (menu.selectedElement) {
      const { type } = menu.selectedElement;
      if (type === 'text') {
        colors.textColor = menu.selectedElement.color || '#000000';
        colors.fillColor = menu.selectedElement.backgroundColor || 'transparent';
      }
      if (type === 'shape') {
        colors.fillColor = menu.selectedElement.fill || 'transparent';
        colors.borderColor = menu.selectedElement.stroke || '#000000';
      }
    }

    return colors;
  }, [currentSlide, menu.selectedElement]);

  const handleContextMenu = useCallback(
    (e: React.MouseEvent, element?: SlideElement, isSlideArea?: boolean) => {
      e.preventDefault();
      if (element) dispatch(handleAction(`SELECT_ELEMENT:${element.id}`));

      setMenu({
        visible: true,
        x: e.clientX,
        y: e.clientY,
        targetType: isSlideArea ? 'slide' : element?.type || 'none',
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
        console.log('Delete slide');
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
    (color: string, type: ColorType) => {
      const selectedElement =
        menu.selectedElement ||
        (selectedElementIds.length > 0 && currentSlide
          ? currentSlide.elements.find((el) => el.id === selectedElementIds[0])
          : null);

      const actionMap: Record<ColorType, string> = {
        text: `TEXT_COLOR:${color}`,
        fill: `SHAPE_FILL:${color}`,
        stroke: `SHAPE_STROKE:${color}`,
        background: `SLIDE_BACKGROUND:${color}`,
      };

      if (selectedElement && type !== 'background') {
        const isValid =
          (type === 'text' && selectedElement.type === 'text') ||
          (type === 'fill' &&
            (selectedElement.type === 'text' || selectedElement.type === 'shape')) ||
          (type === 'stroke' && selectedElement.type === 'shape');
        if (isValid) dispatch(handleAction(actionMap[type]));
      }

      if (type === 'background' && currentSlideId) {
        dispatch(handleAction(actionMap.background));
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
