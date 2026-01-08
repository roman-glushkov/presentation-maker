import { useState } from 'react';

export type GroupKey = 'slides' | 'text' | 'elements' | 'design';
export type ColorType = 'text' | 'fill' | 'background';
export type PopupKey =
  | 'templates'
  | 'textColorPicker'
  | 'fillColorPicker'
  | 'backgroundColorPicker';

interface ToolbarState {
  activeGroup: GroupKey;
  selectedColor: string | null;
  popups: Record<PopupKey, boolean>;
}

export function useToolbarState(initialGroup: GroupKey = 'slides') {
  const [state, setState] = useState<ToolbarState>({
    activeGroup: initialGroup,
    selectedColor: null,
    popups: {
      templates: false,
      textColorPicker: false,
      fillColorPicker: false,
      backgroundColorPicker: false,
    },
  });

  const setActiveGroup = (group: GroupKey) => {
    setState((prev) => ({ ...prev, activeGroup: group }));
  };

  const setSelectedColor = (color: string | null) => {
    setState((prev) => ({ ...prev, selectedColor: color }));
  };

  const setPopup = (popupKey: PopupKey, isOpen: boolean) => {
    setState((prev) => ({
      ...prev,
      popups: {
        ...prev.popups,
        [popupKey]: isOpen,
      },
    }));
  };

  const togglePopup = (popupKey: PopupKey) => {
    setState((prev) => ({
      ...prev,
      popups: {
        ...prev.popups,
        [popupKey]: !prev.popups[popupKey],
      },
    }));
  };

  const openPopup = (popupKey: PopupKey) => {
    setState((prev) => ({
      ...prev,
      popups: Object.keys(prev.popups).reduce(
        (acc, key) => ({
          ...acc,
          [key]: key === popupKey,
        }),
        {} as Record<PopupKey, boolean>
      ),
    }));
  };

  const closeAllPopups = () => {
    setState((prev) => ({
      ...prev,
      popups: Object.keys(prev.popups).reduce(
        (acc, key) => ({
          ...acc,
          [key]: false,
        }),
        {} as Record<PopupKey, boolean>
      ),
    }));
  };

  const closePopup = (popupKey: PopupKey) => {
    setPopup(popupKey, false);
  };

  return {
    state,
    setters: {
      setActiveGroup,
      setSelectedColor,
      setPopup,
      togglePopup,
      openPopup,
      closeAllPopups,
      closePopup,
    },
  } as const;
}
