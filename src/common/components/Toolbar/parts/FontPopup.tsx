import React from 'react';
import { FONT_FAMILY_OPTIONS } from '../constants/textOptions';

interface Props {
  onSelect: (key: string) => void;
}

export default function FontPopup({ onSelect }: Props) {
  return (
    <div className="text-options-popup">
      {FONT_FAMILY_OPTIONS.map((font) => (
        <button
          key={font.key}
          className="text-option-button"
          onClick={() => onSelect(font.key)}
          style={{ fontFamily: font.key }}
        >
          {font.label}
        </button>
      ))}
    </div>
  );
}
