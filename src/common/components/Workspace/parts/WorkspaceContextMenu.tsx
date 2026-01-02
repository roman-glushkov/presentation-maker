// C:\PGTU\FRONT-end\presentation maker\src\common\components\Workspace\parts\WorkspaceContextMenu.tsx
import React, { useRef, useEffect, useState } from 'react';
import { SlideElement } from '../../../../store/types/presentation';
import ColorPickerContext from './ColorPickerContext';

interface WorkspaceContextMenuProps {
  visible: boolean;
  x: number;
  y: number;
  slideAreaHeight: number;
  onClose: () => void;
  onCopy: () => void;
  onPaste: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
  onBringToFront: () => void;
  onSendToBack: () => void;
  onChangeBackground: () => void;
  onChangeTextColor: () => void;
  onChangeFill: () => void;
  onChangeBorderColor: () => void;
  onChangeBorderWidth: () => void;
  targetType?: 'text' | 'image' | 'shape' | 'slide' | 'none';
  selectedElement?: SlideElement | null;
  currentColors?: {
    slideBackground?: string;
    textColor?: string;
    fillColor?: string;
    borderColor?: string;
  };
  // Добавляем пропс для применения цвета
  applyColor?: (color: string, type: 'text' | 'fill' | 'stroke' | 'background') => void;
}

export default function WorkspaceContextMenu({
  visible,
  x,
  y,
  onClose,
  onCopy,
  onPaste,
  onDuplicate,
  onDelete,
  onBringToFront,
  onSendToBack,
  onChangeBackground,
  onChangeTextColor,
  onChangeFill,
  onChangeBorderColor,
  onChangeBorderWidth,
  targetType = 'none',
  currentColors = {},
  applyColor,
}: WorkspaceContextMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [colorPickerType, setColorPickerType] = useState<'text' | 'fill' | 'stroke' | 'background'>(
    'text'
  );
  const [colorPickerPosition, setColorPickerPosition] = useState({ x: 0, y: 0 });

  // Определяем, какие пункты меню показывать
  const showTextColor = targetType === 'text';
  const showFill = targetType === 'text' || targetType === 'shape';
  const showBorderColor = targetType === 'shape';
  const showBorderWidth = targetType === 'shape';
  const showSlideBackground = targetType === 'slide';

  // Общие пункты
  const showCommonItems = targetType !== 'slide' && targetType !== 'none';
  const showLayersItems = targetType !== 'slide' && targetType !== 'none';

  const shouldShowMenu = visible && targetType !== 'none';

  useEffect(() => {
    if (shouldShowMenu && menuRef.current) {
      const menuHeight = menuRef.current.offsetHeight;
      const menuWidth = menuRef.current.offsetWidth;
      const viewportHeight = window.innerHeight;
      const viewportWidth = window.innerWidth;

      let adjustedX = x;
      let adjustedY = y;
      const padding = 10;

      const fitsBelow = y + menuHeight <= viewportHeight - padding;
      const fitsAbove = y - menuHeight >= padding;

      if (fitsBelow) {
        adjustedY = y;
      } else if (fitsAbove) {
        adjustedY = y - menuHeight;
      } else {
        adjustedY = (viewportHeight - menuHeight) / 2;
      }

      const fitsRight = x + menuWidth <= viewportWidth - padding;
      const fitsLeft = x - menuWidth >= padding;

      if (fitsRight) {
        adjustedX = x;
      } else if (fitsLeft) {
        adjustedX = x - menuWidth;
      } else {
        adjustedX = (viewportWidth - menuWidth) / 2;
      }

      adjustedX = Math.max(padding, Math.min(adjustedX, viewportWidth - menuWidth - padding));
      adjustedY = Math.max(padding, Math.min(adjustedY, viewportHeight - menuHeight - padding));

      setPosition({ x: adjustedX, y: adjustedY });
    }
  }, [shouldShowMenu, x, y]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
        setShowColorPicker(false);
      }
    };

    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (showColorPicker) {
          setShowColorPicker(false);
        } else {
          onClose();
        }
      }
    };

    const handleScroll = () => {
      onClose();
      setShowColorPicker(false);
    };

    if (shouldShowMenu || showColorPicker) {
      document.addEventListener('click', handleClickOutside);
      document.addEventListener('keydown', handleEsc);
      window.addEventListener('scroll', handleScroll, true);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEsc);
      window.removeEventListener('scroll', handleScroll, true);
    };
  }, [shouldShowMenu, showColorPicker, onClose]);

  // Функция для рендера цветного квадрата
  const renderColorSquare = (color: string | undefined, defaultColor: string = '#cccccc') => {
    const displayColor = color === 'transparent' || !color ? defaultColor : color;

    return (
      <div
        className="color-square"
        style={{
          display: 'inline-block',
          width: '16px',
          height: '16px',
          backgroundColor: displayColor,
          border: '1px solid #888',
          marginRight: '8px',
          verticalAlign: 'middle',
          borderRadius: '2px',
          boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
        }}
      />
    );
  };

  // Обработчик для открытия цветовой палитры
  const handleColorPickerOpen = (
    type: 'text' | 'fill' | 'stroke' | 'background',
    e: React.MouseEvent
  ) => {
    e.stopPropagation();

    // Вызываем соответствующий обработчик для логики
    switch (type) {
      case 'text':
        onChangeTextColor();
        break;
      case 'fill':
        onChangeFill();
        break;
      case 'stroke':
        onChangeBorderColor();
        break;
      case 'background':
        onChangeBackground();
        break;
    }

    // Рассчитываем позицию для цветовой палитры (правее от меню)
    const pickerX = position.x + (menuRef.current?.offsetWidth || 200) + 5;
    const pickerY = position.y;

    setColorPickerType(type);
    setColorPickerPosition({ x: pickerX, y: pickerY });
    setShowColorPicker(true);
  };

  // Обработчик выбора цвета
  const handleColorSelect = (color: string) => {
    // Закрываем палитру
    setShowColorPicker(false);

    // Применяем цвет если есть функция applyColor
    if (applyColor) {
      applyColor(color, colorPickerType);
    }

    // Закрываем меню
    onClose();
  };

  if (!shouldShowMenu) return null;

  return (
    <>
      <div
        ref={menuRef}
        className="workspace-context-menu"
        style={{
          top: `${position.y}px`,
          left: `${position.x}px`,
          position: 'fixed',
          zIndex: 1000,
          minWidth: '200px',
          backgroundColor: 'white',
          border: '1px solid #ddd',
          borderRadius: '4px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          padding: '4px 0',
        }}
      >
        {/* Общие пункты меню */}
        {showCommonItems && (
          <>
            <button
              onClick={() => {
                onCopy();
                onClose();
              }}
              className="context-menu-item"
              style={menuItemStyle}
            >
              <span className="menu-icon" style={iconStyle}>
                📋
              </span>{' '}
              Копировать
            </button>

            <button
              onClick={() => {
                onPaste();
                onClose();
              }}
              className="context-menu-item"
              style={menuItemStyle}
            >
              <span className="menu-icon" style={iconStyle}>
                📝
              </span>{' '}
              Вставить
            </button>

            <button
              onClick={() => {
                onDuplicate();
                onClose();
              }}
              className="context-menu-item"
              style={menuItemStyle}
            >
              <span className="menu-icon" style={iconStyle}>
                ⎘
              </span>{' '}
              Дублировать
            </button>

            <button
              onClick={() => {
                onDelete();
                onClose();
              }}
              className="context-menu-item"
              style={menuItemStyle}
            >
              <span className="menu-icon" style={iconStyle}>
                🗑️
              </span>{' '}
              Удалить
            </button>

            <div style={dividerStyle} />
          </>
        )}

        {/* Слой/порядок */}
        {showLayersItems && (
          <>
            <button
              onClick={() => {
                onBringToFront();
                onClose();
              }}
              className="context-menu-item"
              style={menuItemStyle}
            >
              <span className="menu-icon" style={iconStyle}>
                ⬆️
              </span>{' '}
              На передний план
            </button>

            <button
              onClick={() => {
                onSendToBack();
                onClose();
              }}
              className="context-menu-item"
              style={menuItemStyle}
            >
              <span className="menu-icon" style={iconStyle}>
                ⬇️
              </span>{' '}
              На задний план
            </button>

            <div style={dividerStyle} />
          </>
        )}

        {/* Фон слайда (только для слайда) */}
        {showSlideBackground && (
          <button
            onClick={(e) => handleColorPickerOpen('background', e)}
            className="context-menu-item"
            style={menuItemStyle}
          >
            {renderColorSquare(currentColors.slideBackground, '#ffffff')}
            Фон слайда
          </button>
        )}

        {/* Цвет текста (только для текста) */}
        {showTextColor && (
          <button
            onClick={(e) => handleColorPickerOpen('text', e)}
            className="context-menu-item"
            style={menuItemStyle}
          >
            {renderColorSquare(currentColors.textColor, '#000000')}
            Цвет текста
          </button>
        )}

        {/* Заливка (для текста и фигур) */}
        {showFill && (
          <button
            onClick={(e) => handleColorPickerOpen('fill', e)}
            className="context-menu-item"
            style={menuItemStyle}
          >
            {renderColorSquare(currentColors.fillColor, 'transparent')}
            Заливка
          </button>
        )}

        {/* Границы (только для фигур) */}
        {(showBorderColor || showBorderWidth) && (
          <>
            {showBorderColor && (
              <button
                onClick={(e) => handleColorPickerOpen('stroke', e)}
                className="context-menu-item"
                style={menuItemStyle}
              >
                {renderColorSquare(currentColors.borderColor, '#000000')}
                Цвет границы
              </button>
            )}

            {showBorderWidth && (
              <button
                onClick={() => {
                  onChangeBorderWidth();
                  onClose();
                }}
                className="context-menu-item"
                style={menuItemStyle}
              >
                <span className="menu-icon" style={{ marginRight: '8px' }}>
                  📏
                </span>
                Толщина границы
              </button>
            )}
          </>
        )}
      </div>

      {/* Цветовая палитра */}
      {showColorPicker && (
        <ColorPickerContext
          type={colorPickerType}
          position={colorPickerPosition}
          onSelectColor={handleColorSelect}
          onClose={() => setShowColorPicker(false)}
        />
      )}
    </>
  );
}

// Стили в виде объектов для простоты
const menuItemStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  padding: '8px 16px',
  width: '100%',
  textAlign: 'left',
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  fontSize: '14px',
  color: '#333',
  fontFamily: 'inherit',
  whiteSpace: 'nowrap',
};

const iconStyle: React.CSSProperties = {
  marginRight: '8px',
  fontSize: '16px',
  width: '16px',
  textAlign: 'center',
};

const dividerStyle: React.CSSProperties = {
  height: '1px',
  backgroundColor: '#eee',
  margin: '4px 0',
  width: '100%',
};
