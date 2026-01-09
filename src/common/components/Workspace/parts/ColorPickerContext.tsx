import React from 'react';
import { THEME_COLUMNS, STANDARD_COLORS } from '../../Toolbar/constants/colors';
import ColorSwatchButton from './ColorSwatchButton';

import '../styles/ColorPickerContext.css';

interface ColorPickerContextProps {
  type: 'text' | 'fill' | 'stroke' | 'background';
  position: { x: number; y: number };
  onSelectColor: (color: string) => void;
  onClose: () => void;
}

const TITLES = {
  text: 'Цвет текста',
  fill: 'Заливка',
  stroke: 'Цвет границы',
  background: 'Фон слайда',
} as const;

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
      <div className="color-picker-header">
        <h4>{TITLES[type] || 'Выберите цвет'}</h4>
      </div>

      <div className="color-section">
        <div className="color-section-title">Цвета темы</div>
        <div className="theme-colors">
          {THEME_COLUMNS.map((column, ci) => (
            <div key={ci} className="theme-column">
              {column.map((color) => (
                <ColorSwatchButton
                  key={color}
                  color={color}
                  onClick={onSelectColor}
                  title={color}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="color-section">
        <div className="color-section-title">Стандартные цвета</div>
        <div className="standard-colors">
          {STANDARD_COLORS.map((color) => (
            <ColorSwatchButton key={color} color={color} onClick={onSelectColor} title={color} />
          ))}
        </div>
      </div>

      <div className="color-picker-actions">
        <button
          className="color-picker-button"
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
        >
          Отмена
        </button>
      </div>
    </div>
  );
}
