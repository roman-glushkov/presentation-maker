// components/Toolbar/ShapeSmoothingMenu.tsx
import React from 'react';
import { SHAPE_SMOOTHING_OPTIONS } from '../constants/textOptions';

interface Props {
  onSelect: (key: string) => void;
}

export default function ShapeSmoothingMenu({ onSelect }: Props) {
  return (
    <div className="text-options-popup">
      {SHAPE_SMOOTHING_OPTIONS.map((option) => (
        <button
          key={option.key}
          className="text-option-button"
          onClick={() => onSelect(option.key)}
          title={option.label}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
