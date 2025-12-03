import React from 'react';
import { TEXT_ALIGN_OPTIONS, TEXT_VERTICAL_ALIGN_OPTIONS } from '../constants/textOptions';

interface Props {
  onSelect: (key: string) => void;
}

export default function TextAlignPopup({ onSelect }: Props) {
  return (
    <div className="text-align-popup">
      <div className="align-section">
        <div className="align-title">Горизонтально</div>
        {TEXT_ALIGN_OPTIONS.map((opt) => (
          <button key={opt.key} className="text-option-button" onClick={() => onSelect(opt.key)}>
            {opt.label}
          </button>
        ))}
      </div>

      <div className="align-section">
        <div className="align-title">Вертикально</div>
        {TEXT_VERTICAL_ALIGN_OPTIONS.map((opt) => (
          <button key={opt.key} className="text-option-button" onClick={() => onSelect(opt.key)}>
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}
