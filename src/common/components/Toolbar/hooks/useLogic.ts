import { useToolbarState } from './useState';
import { useCallback } from 'react';

type TextAlignHorizontal = 'left' | 'center' | 'right' | 'justify';
type TextAlignVertical = 'top' | 'middle' | 'bottom';

export function useToolbarLogic(onAction: (action: string) => void) {
  const { state, setters } = useToolbarState();
  const { popups, activeGroup, selectedColor } = state;
  const { setActiveGroup, openPopup, closeAllPopups, closePopup } = setters;

  const handleAddSlideClick = useCallback(() => {
    openPopup('templates');
  }, [openPopup]);

  const handleTemplateSelect = useCallback(
    (template: string) => {
      onAction(template);
      closePopup('templates');
    },
    [onAction, closePopup]
  );

  const handleTextColorClick = useCallback(() => {
    openPopup('textColorPicker');
  }, [openPopup]);

  const handleFillColorClick = useCallback(() => {
    openPopup('fillColorPicker');
  }, [openPopup]);

  const handleBackgroundColorClick = useCallback(() => {
    openPopup('backgroundColorPicker');
  }, [openPopup]);

  const handleColorSelect = useCallback(
    (type: 'text' | 'fill' | 'background', color: string) => {
      const actionMap = {
        text: 'TEXT_COLOR',
        fill: 'SHAPE_FILL',
        background: 'SLIDE_BACKGROUND',
      } as const;

      onAction(`${actionMap[type]}: ${color}`);
      closeAllPopups();
    },
    [onAction, closeAllPopups]
  );

  const handleTextOptionSelect = useCallback(
    (key: string) => {
      const numValue = Number(key);

      if (key.endsWith('px')) {
        onAction(`TEXT_SIZE: ${key}`);
      } else if (['left', 'center', 'right', 'justify'].includes(key)) {
        onAction(`TEXT_ALIGN_HORIZONTAL: ${key as TextAlignHorizontal}`);
      } else if (['top', 'middle', 'bottom'].includes(key)) {
        onAction(`TEXT_ALIGN_VERTICAL: ${key as TextAlignVertical}`);
      } else if (!isNaN(numValue)) {
        onAction(`TEXT_LINE_HEIGHT: ${numValue}`);
      }
    },
    [onAction]
  );

  return {
    state: {
      activeGroup,
      selectedColor,
      showTemplates: popups.templates,
      showTextColorPicker: popups.textColorPicker,
      showFillColorPicker: popups.fillColorPicker,
      showBackgroundColorPicker: popups.backgroundColorPicker,
    },
    handlers: {
      setActiveGroup,
      resetPopups: closeAllPopups,
      handleAddSlideClick,
      handleTemplateSelect,
      handleTextColorClick,
      handleFillColorClick,
      handleBackgroundColorClick,
      handleColorSelect,
      handleTextOptionSelect,
    },
  } as const;
}
