// C:\PGTU\FRONT-end\presentation maker\src\common\components\Workspace\hooks\useWorkspaceContextMenu.ts
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
  // Убираем параметры color - они не нужны, так как выбор цвета будет в контекстном меню
  handleChangeBackground: () => void;
  handleChangeTextColor: () => void;
  handleChangeFill: () => void;
  handleChangeBorderColor: () => void;
  handleChangeBorderWidth: () => void;
  closeMenu: () => void;
  currentColors: {
    slideBackground?: string;
    textColor?: string;
    fillColor?: string;
    borderColor?: string;
  };
  // Добавляем функцию для применения цвета
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

  // Получаем текущий слайд и его элементы
  const currentSlide = useSelector((state: RootState) =>
    state.editor.presentation.slides.find((s) => s.id === state.editor.selectedSlideId)
  );

  // Вычисляем текущие цвета для отображения в меню
  const currentColors = useMemo(() => {
    const colors: {
      slideBackground?: string;
      textColor?: string;
      fillColor?: string;
      borderColor?: string;
    } = {};

    // Цвет фона слайда
    if (currentSlide?.background?.type === 'color') {
      colors.slideBackground = currentSlide.background.value;
    } else {
      colors.slideBackground = '#ffffff'; // дефолтный цвет
    }

    // Цвета выбранного элемента
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

      let targetType: 'text' | 'image' | 'shape' | 'slide' | 'none' = 'none';
      let selectedElement: SlideElement | null = null;

      if (isSlideArea) {
        targetType = 'slide';
      } else if (element) {
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
        // Здесь нужно использовать removeSlide action
        console.log('Удалить слайд:', currentSlideId);
        // dispatch(removeSlide(currentSlideId));
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

  // Эти функции теперь просто отмечают, что нужно открыть палитру
  const handleChangeBackground = useCallback(() => {
    console.log('Открыть палитру для фона слайда');
    // Логика открытия палитры будет в WorkspaceContextMenu
  }, []);

  const handleChangeTextColor = useCallback(() => {
    console.log('Открыть палитру для цвета текста');
    // Логика открытия палитры будет в WorkspaceContextMenu
  }, []);

  const handleChangeFill = useCallback(() => {
    console.log('Открыть палитру для заливки');
    // Логика открытия палитры будет в WorkspaceContextMenu
  }, []);

  const handleChangeBorderColor = useCallback(() => {
    console.log('Открыть палитру для цвета границы');
    // Логика открытия палитры будет в WorkspaceContextMenu
  }, []);

  const handleChangeBorderWidth = useCallback(() => {
    if (menu.targetType === 'shape' && menu.selectedElement?.id) {
      // Для примера устанавливаем 2px
      dispatch(handleAction(`SHAPE_STROKE_WIDTH:2`));
    }
  }, [dispatch, menu.targetType, menu.selectedElement]);

  // Функция для применения выбранного цвета
  const applyColor = useCallback(
    (color: string, type: 'text' | 'fill' | 'stroke' | 'background') => {
      console.log('🎨 applyColor вызван:', {
        color,
        type,
        selectedElementIds,
        currentSlideId,
        menuTargetType: menu.targetType,
        selectedElement: menu.selectedElement,
      });

      // Находим выбранный элемент
      const selectedElement =
        selectedElementIds.length > 0 && currentSlide
          ? currentSlide.elements.find((el) => el.id === selectedElementIds[0])
          : null;

      console.log('📌 Найденный элемент:', selectedElement);

      switch (type) {
        case 'text':
          if (selectedElement?.type === 'text') {
            console.log('✅ Применяем цвет текста:', color);
            dispatch(handleAction(`TEXT_COLOR:${color}`));
          } else {
            console.log('❌ Нельзя применить цвет текста: элемент не найден или не текст');
          }
          break;
        case 'fill':
          if (
            selectedElement &&
            (selectedElement.type === 'text' || selectedElement.type === 'shape')
          ) {
            console.log('✅ Применяем цвет заливки:', color);
            dispatch(handleAction(`SHAPE_FILL:${color}`));
          } else {
            console.log('❌ Нельзя применить цвет заливки: элемент не найден или не текст/фигура');
          }
          break;
        case 'stroke':
          if (selectedElement?.type === 'shape') {
            console.log('✅ Применяем цвет границы:', color);
            dispatch(handleAction(`SHAPE_STROKE:${color}`));
          } else {
            console.log('❌ Нельзя применить цвет границы: элемент не найден или не фигура');
          }
          break;
        case 'background':
          if (currentSlideId) {
            console.log('✅ Применяем цвет фона слайда:', color);
            dispatch(handleAction(`SLIDE_BACKGROUND: ${color}`));
          } else {
            console.log('❌ Нельзя применить цвет фона: слайд не выбран');
          }
          break;
      }
    },
    [
      dispatch,
      selectedElementIds,
      currentSlide,
      currentSlideId,
      menu.targetType,
      menu.selectedElement,
    ]
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
    handleChangeBorderWidth,
    closeMenu,
    currentColors,
    applyColor,
  };
}
