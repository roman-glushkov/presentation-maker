import { useToolbarState } from './useState';

export function useToolbarLogic(onAction: (action: string) => void) {
  const {
    activeGroup,
    setActiveGroup,
    showTemplates,
    setShowTemplates,
    showTextColorPicker,
    setShowTextColorPicker,
    showFillColorPicker,
    setShowFillColorPicker,
    showBackgroundColorPicker,
    setShowBackgroundColorPicker,
    resetPopups,
  } = useToolbarState();

  const handleAddSlideClick = () => {
    setShowTemplates(!showTemplates);
    setShowTextColorPicker(false);
    setShowFillColorPicker(false);
  };

  const handleTemplateSelect = (template: string) => {
    onAction(template);
    setShowTemplates(false);
  };

  const handleTextColorClick = () => {
    setShowTextColorPicker(!showTextColorPicker);
    setShowTemplates(false);
    setShowFillColorPicker(false);
  };

  const handleFillColorClick = () => {
    setShowFillColorPicker(!showFillColorPicker);
    setShowTextColorPicker(false);
    setShowTemplates(false);
  };
  const handleBackgroundColorClick = () => {
    setShowBackgroundColorPicker(!showBackgroundColorPicker);
    setShowTextColorPicker(false);
    setShowFillColorPicker(false);
    setShowTemplates(false);
  };

  const handleColorSelect = (type: 'text' | 'fill' | 'background', color: string) => {
    if (type === 'text') onAction(`TEXT_COLOR: ${color}`);
    else if (type === 'fill') onAction(`SHAPE_FILL: ${color}`);
    else onAction(`SLIDE_BACKGROUND: ${color}`);
    setShowTextColorPicker(false);
    setShowFillColorPicker(false);
    setShowBackgroundColorPicker(false);
  };

  const handleTextOptionSelect = (key: string) => {
    if (key.endsWith('px')) {
      onAction(`TEXT_SIZE: ${key}`);
    } else if (['left', 'center', 'right', 'justify'].includes(key)) {
      onAction(`TEXT_ALIGN_HORIZONTAL: ${key}`);
    } else if (['top', 'middle', 'bottom'].includes(key)) {
      onAction(`TEXT_ALIGN_VERTICAL: ${key}`);
    } else if (!isNaN(Number(key))) {
      onAction(`TEXT_LINE_HEIGHT: ${key}`);
    }
  };

  return {
    state: {
      activeGroup,
      showTemplates,
      showTextColorPicker,
      showFillColorPicker,
      showBackgroundColorPicker,
    },
    handlers: {
      setActiveGroup,
      resetPopups,
      handleAddSlideClick,
      handleTemplateSelect,
      handleTextColorClick,
      handleFillColorClick,
      handleBackgroundColorClick,
      handleColorSelect,
      handleTextOptionSelect,
    },
  };
}
