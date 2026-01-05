// components/Toolbar/TextShadowMenu.tsx (упрощенная)
import React from 'react';
import { TEXT_SHADOW_OPTIONS } from '../constants/textOptions';

interface Props {
  onSelect: (key: string) => void;
}

export default function TextShadowMenu({ onSelect }: Props) {
  return (
    <div className="text-options-popup">
      {TEXT_SHADOW_OPTIONS.map((option) => (
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
