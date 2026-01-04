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
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
        >
          <span style={{ marginRight: '8px' }}>{option.label}</span>
          <div
            style={{
              position: 'relative',
              width: '40px',
              height: '30px',
              border: '1px solid rgba(255,255,255,0.3)',
              borderRadius: '4px',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <div
              style={{
                width: '100%',
                height: '60%',
                backgroundColor: '#3b82f6',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '10px',
                fontWeight: 'bold',
              }}
            >
              Текст
            </div>
            <div
              style={{
                width: '100%',
                height: '40%',
                background:
                  option.key === 'colored'
                    ? `linear-gradient(to bottom, rgba(59, 130, 246, ${option.value}) 0%, rgba(59, 130, 246, 0) 100%)`
                    : `linear-gradient(to bottom, rgba(255,255,255,${option.value}) 0%, rgba(255,255,255,0) 100%)`,
                transition: 'all 0.2s ease',
              }}
            />
          </div>
        </button>
      ))}
    </div>
  );
}
