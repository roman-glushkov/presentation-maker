import React from 'react';
import { SHAPE_OPTIONS } from '../constants/shapes';

interface Props {
  onSelect: (shapeType: string) => void;
}

export default function ShapePopup({ onSelect }: Props) {
  return (
    <div className="text-options-popup">
      {SHAPE_OPTIONS.map((shape) => (
        <button
          key={shape.type}
          className="text-option-button"
          onClick={() => onSelect(shape.type)}
          title={shape.label}
        >
          <span style={{ marginRight: '8px', fontSize: '16px' }}>{shape.icon}</span>
          {shape.label}
        </button>
      ))}
    </div>
  );
}
