import React from 'react';
import { THEME_COLUMNS, STANDARD_COLORS } from '../components/Toolbar/constants/colors';
import ColorSwatchButton from './ColorSwatchButton';
import './styles/ColorPickerContext.css';
import './styles/ColorSection.css';

interface ColorPickerProps {
  type?: 'text' | 'fill' | 'stroke' | 'background';
  title?: string;
  onSelectColor: (color: string) => void;
  showTitle?: boolean;
  showCancelButton?: boolean;
  onClose?: () => void;
  className?: string;
}

const TITLES = {
  text: 'Цвет текста',
  fill: 'Заливка',
  stroke: 'Цвет границы',
  background: 'Фон слайда',
} as const;

export default function ColorPicker({
  type = 'text',
  title,
  onSelectColor,
  showTitle = true,
  showCancelButton = false,
  onClose,
  className = '',
}: ColorPickerProps) {
  const displayTitle = title || TITLES[type] || 'Выберите цвет';

  return (
    <div className={`color-picker ${className}`} onClick={(e) => e.stopPropagation()}>
      {showTitle && (
        <div className="color-picker-header">
          <h4>{displayTitle}</h4>
        </div>
      )}

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

      {showCancelButton && onClose && (
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
      )}
    </div>
  );
}
