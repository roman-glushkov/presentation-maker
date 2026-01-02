// C:\PGTU\FRONT-end\presentation maker\src\common\components\Workspace\parts\ColorPickerContext.tsx
import React from 'react';
import ColorSwatchButton from './ColorSwatchButton';

// Копируем цвета прямо сюда
const THEME_COLUMNS: string[][] = [
  ['#ffffff', '#d8d8d8', '#bfbfbf', '#a5a5a5', '#7f7f7f'],
  ['#7f7f7f', '#595959', '#3f3f3f', '#262626', '#0c0c0c'],
  ['#d0cecf', '#adadab', '#74706f', '#3a3839', '#161616'],
  ['#d5dce4', '#adb8ca', '#8697b1', '#323f4f', '#222834'],
  ['#dee8f2', '#bdd7ee', '#9cc2e6', '#2e75b5', '#1f4e7a'],
  ['#fae3d3', '#f8cbac', '#f4b184', '#c55b11', '#843e0d'],
  ['#ededed', '#dbdbdb', '#c9c9c9', '#7b7b7b', '#525252'],
  ['#fff2cd', '#ffe59a', '#fed966', '#bf9100', '#7e6000'],
  ['#d9e2f3', '#b2c5e5', '#8eaada', '#2e5495', '#203864'],
  ['#e2f0d9', '#c5e0b3', '#a7d08c', '#538136', '#385624'],
];

const STANDARD_COLORS: string[] = [
  '#c00000',
  '#ff0101',
  '#febe00',
  '#ffc000',
  '#8fd04e',
  '#00af50',
  '#01b0f1',
  '#0071c2',
  '#012060',
  '#7030a0',
];

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
  const handleColorSelect = (color: string) => {
    console.log('🎨 Цвет выбран в палитре:', { color, type });
    onSelectColor(color);
  };

  // Определяем заголовок в зависимости от типа
  const getTitle = () => {
    switch (type) {
      case 'text':
        return 'Цвет текста';
      case 'fill':
        return 'Заливка';
      case 'stroke':
        return 'Цвет границы';
      case 'background':
        return 'Фон слайда';
      default:
        return 'Выберите цвет';
    }
  };

  // Рассчитываем правильную позицию
  const calculatePosition = () => {
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const pickerWidth = 280;
    const pickerHeight = 200;

    let adjustedX = position.x;
    let adjustedY = position.y;

    if (adjustedX + pickerWidth > viewportWidth - 10) {
      adjustedX = viewportWidth - pickerWidth - 10;
    }

    if (adjustedY + pickerHeight > viewportHeight - 10) {
      adjustedY = viewportHeight - pickerHeight - 10;
    }

    if (adjustedY < 10) {
      adjustedY = 10;
    }

    if (adjustedX < 10) {
      adjustedX = 10;
    }

    return { x: adjustedX, y: adjustedY };
  };

  const finalPosition = calculatePosition();

  return (
    <div
      className="color-picker-context"
      style={{
        position: 'fixed',
        top: `${finalPosition.y}px`,
        left: `${finalPosition.x}px`,
        zIndex: 1001,
        backgroundColor: 'white',
        border: '1px solid #ddd',
        borderRadius: '10px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.25)',
        padding: '12px 14px',
        minWidth: '260px',
        maxWidth: '280px',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      }}
      onClick={(e) => {
        console.log('👆 Клик по контейнеру палитры');
        e.stopPropagation();
      }}
    >
      <div
        className="color-picker-header"
        style={{
          marginBottom: '12px',
          borderBottom: '1px solid rgba(255,255,255,0.15)',
          paddingBottom: '6px',
        }}
      >
        <h4
          style={{
            margin: '0',
            fontSize: '14px',
            fontWeight: '600',
            color: '#ffffff',
            textAlign: 'center',
          }}
        >
          {getTitle()}
        </h4>
      </div>

      <div className="color-section" style={{ marginBottom: '12px' }}>
        <div
          className="color-section-title"
          style={{
            fontSize: '13px',
            fontWeight: '600',
            color: '#ffffff',
            marginBottom: '8px',
            paddingBottom: '4px',
            borderBottom: '1px solid rgba(255,255,255,0.15)',
          }}
        >
          Цвета темы
        </div>
        <div
          className="theme-colors"
          style={{
            display: 'flex',
            gap: '6px',
            justifyContent: 'center',
          }}
        >
          {THEME_COLUMNS.map((column: string[], ci: number) => (
            <div
              key={ci}
              className="theme-column"
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '4px',
              }}
            >
              {column.map((color: string) => (
                <ColorSwatchButton
                  key={color}
                  color={color}
                  onClick={handleColorSelect}
                  title={color}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="color-section" style={{ marginBottom: '12px' }}>
        <div
          className="color-section-title"
          style={{
            fontSize: '13px',
            fontWeight: '600',
            color: '#ffffff',
            marginBottom: '8px',
            paddingBottom: '4px',
            borderBottom: '1px solid rgba(255,255,255,0.15)',
          }}
        >
          Стандартные цвета
        </div>
        <div
          className="standard-colors"
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '6px',
            flexWrap: 'wrap',
          }}
        >
          {STANDARD_COLORS.map((color: string) => (
            <ColorSwatchButton
              key={color}
              color={color}
              onClick={handleColorSelect}
              title={color}
            />
          ))}
        </div>
      </div>

      <div
        style={{
          marginTop: '12px',
          display: 'flex',
          justifyContent: 'flex-end',
          borderTop: '1px solid rgba(255,255,255,0.15)',
          paddingTop: '8px',
        }}
      >
        <button
          onClick={(e) => {
            e.stopPropagation();
            console.log('❌ Отмена');
            onClose();
          }}
          style={{
            padding: '6px 16px',
            fontSize: '13px',
            backgroundColor: 'rgba(255,255,255,0.1)',
            border: '1px solid rgba(255,255,255,0.2)',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: '500',
            color: '#ffffff',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.2)';
            e.currentTarget.style.transform = 'translateY(-1px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          Отмена
        </button>
      </div>
    </div>
  );
}
