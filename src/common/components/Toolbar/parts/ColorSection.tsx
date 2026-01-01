import React from 'react';
import { THEME_COLUMNS, STANDARD_COLORS } from '../constants/colors';
import ThemeColorButton from './ThemeButton';
import { useAppDispatch, useAppSelector } from '../../../../store/hooks';
import { handleAction } from '../../../../store/editorSlice';

interface Props {
  type: 'text' | 'fill' | 'stroke' | 'background'; // ← ДОБАВИЛИ 'stroke'
}

export default function ColorSection({ type }: Props) {
  const dispatch = useAppDispatch();
  const selectedElementId = useAppSelector((state) => state.editor.selectedElementIds);

  const onSelectColor = (color: string) => {
    switch (type) {
      case 'text':
        if (selectedElementId) dispatch(handleAction(`TEXT_COLOR:${color}`));
        break;
      case 'fill':
        if (selectedElementId) dispatch(handleAction(`SHAPE_FILL:${color}`));
        break;
      case 'stroke':
        if (selectedElementId) dispatch(handleAction(`SHAPE_STROKE:${color}`));
        break;
      case 'background':
        dispatch(handleAction(`SLIDE_BACKGROUND: ${color}`));
        break;
    }
  };

  return (
    <div className="color-picker-popup">
      <div className="color-section">
        <div className="color-section-title">Цвета темы</div>
        <div className="theme-colors">
          {THEME_COLUMNS.map((column, ci) => (
            <div key={ci} className="theme-column">
              {column.map((color) => (
                <ThemeColorButton key={color} color={color} onClick={onSelectColor} />
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="color-section">
        <div className="color-section-title">Стандартные цвета</div>
        <div className="standard-colors">
          {STANDARD_COLORS.map((color) => (
            <ThemeColorButton key={color} color={color} onClick={onSelectColor} />
          ))}
        </div>
      </div>
    </div>
  );
}
