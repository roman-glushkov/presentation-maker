// components/Toolbar/TextShadowMenu.tsx
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
          <span
            style={{
              marginRight: '8px',
              fontSize: '16px',
              display: 'inline-block',
              width: '24px',
              height: '24px',
              borderRadius: '4px',
              backgroundColor: option.key === 'none' ? 'transparent' : option.color,
              border: option.key === 'none' ? '1px dashed #999' : '1px solid rgba(0,0,0,0.1)',
              boxShadow: option.key === 'none' ? 'none' : `0 2px ${option.blur}px ${option.color}`,
              verticalAlign: 'middle',
            }}
          >
            {option.key === 'none' && '✗'}
          </span>
        </button>
      ))}
    </div>
  );
}
