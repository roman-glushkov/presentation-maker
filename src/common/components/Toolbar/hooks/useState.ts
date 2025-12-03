import { useState } from 'react';

export type GroupKey = 'slides' | 'text' | 'elements' | 'design';

export function useToolbarState(initial: GroupKey = 'slides') {
  const [activeGroup, setActiveGroup] = useState<GroupKey>(initial);
  const [showTemplates, setShowTemplates] = useState(false);
  const [showTextColorPicker, setShowTextColorPicker] = useState(false);
  const [showFillColorPicker, setShowFillColorPicker] = useState(false);
  const [showBackgroundColorPicker, setShowBackgroundColorPicker] = useState(false);

  const resetPopups = () => {
    setShowTemplates(false);
    setShowTextColorPicker(false);
    setShowFillColorPicker(false);
    setShowBackgroundColorPicker(false);
  };

  return {
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
  } as const;
}
