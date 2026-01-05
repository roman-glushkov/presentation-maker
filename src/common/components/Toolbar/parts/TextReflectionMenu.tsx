// components/Toolbar/TextReflectionMenu.tsx
import React from 'react';
import { TEXT_REFLECTION_OPTIONS } from '../constants/textOptions';

interface Props {
  onSelect: (key: string, value: number) => void;
}

export default function TextReflectionMenu({ onSelect }: Props) {
  return (
    <div className="text-options-popup">
      {TEXT_REFLECTION_OPTIONS.map((option) => (
        <button
          key={option.key}
          className="text-option-button"
          onClick={() => onSelect(option.key, option.value)}
          title={option.label}
        >
          <span>{option.label}</span>
        </button>
      ))}
    </div>
  );
}
