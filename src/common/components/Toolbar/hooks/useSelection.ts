import { useState } from 'react';

export type ColorPickerType = 'text' | 'fill';

export function useColorSelection() {
  const [selectedColor, setSelectedColor] = useState<string | null>(null);

  const selectColor = (color: string) => {
    setSelectedColor(color);
  };

  return {
    selectedColor,
    selectColor,
  } as const;
}
