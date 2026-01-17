// src/common/components/Workspace/parts/ColorPickerContext.tsx
import React from 'react';
import ColorPicker from '../../../shared/ColorPicker';

interface ColorPickerContextProps {
  type: 'text' | 'fill' | 'stroke' | 'background';
  position: { x: number; y: number };
  onSelectColor: (color: string) => void;
  onClose: () => void;
}

export default function ColorPickerContext({
  type,
  position,
  onSelectColor,
  onClose,
}: ColorPickerContextProps) {
  const calculatePosition = () => {
    const { innerWidth: vw, innerHeight: vh } = window;
    const pickerWidth = 280;
    const pickerHeight = 200;
    const padding = 10;

    return {
      x: Math.max(padding, Math.min(position.x, vw - pickerWidth - padding)),
      y: Math.max(padding, Math.min(position.y, vh - pickerHeight - padding)),
    };
  };

  const finalPosition = calculatePosition();

  return (
    <div
      className="color-picker-context"
      style={{ top: `${finalPosition.y}px`, left: `${finalPosition.x}px` }}
      onClick={(e) => e.stopPropagation()}
    >
      <ColorPicker
        type={type}
        onSelectColor={onSelectColor}
        showCancelButton={true}
        onClose={onClose}
      />
    </div>
  );
}
