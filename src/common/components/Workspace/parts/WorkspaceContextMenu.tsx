import React, { useRef, useEffect, useState } from 'react';
import { SlideElement } from '../../../../store/types/presentation'; // Импортируем тип

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
  // Добавляем новые пропсы
  targetType?: 'text' | 'image' | 'shape' | 'slide' | 'none';
  selectedElement?: SlideElement | null;
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
  // Новые пропсы с значениями по умолчанию
  targetType = 'none',
}: WorkspaceContextMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  // Определяем, какие пункты меню показывать
  const showTextColor = targetType === 'text';
  const showFill = targetType === 'text' || targetType === 'shape';
  const showBorderColor = targetType === 'shape';
  const showBorderWidth = targetType === 'shape';
  const showSlideBackground = targetType === 'slide';

  // Общие пункты, которые показываются всегда (если есть выбранные элементы)
  const showCommonItems = targetType !== 'slide' && targetType !== 'none';
  const showLayersItems = targetType !== 'slide' && targetType !== 'none';

  // Показывать ли меню вообще
  const shouldShowMenu = visible && targetType !== 'none';

  useEffect(() => {
    if (shouldShowMenu && menuRef.current) {
      // ... существующий код позиционирования ...
      const menuHeight = menuRef.current.offsetHeight;
      const menuWidth = menuRef.current.offsetWidth;
      const viewportHeight = window.innerHeight;
      const viewportWidth = window.innerWidth;

      let adjustedX = x;
      let adjustedY = y;
      const padding = 10;

      // Проверяем, помещается ли меню по вертикали снизу
      const fitsBelow = y + menuHeight <= viewportHeight - padding;
      // Проверяем, помещается ли меню по вертикали сверху
      const fitsAbove = y - menuHeight >= padding;

      if (fitsBelow) {
        adjustedY = y;
      } else if (fitsAbove) {
        adjustedY = y - menuHeight;
      } else {
        adjustedY = (viewportHeight - menuHeight) / 2;
      }

      // Проверяем, помещается ли меню справа
      const fitsRight = x + menuWidth <= viewportWidth - padding;
      // Проверяем, помещается ли меню слева
      const fitsLeft = x - menuWidth >= padding;

      if (fitsRight) {
        adjustedX = x;
      } else if (fitsLeft) {
        adjustedX = x - menuWidth;
      } else {
        adjustedX = (viewportWidth - menuWidth) / 2;
      }

      // Финальная корректировка
      adjustedX = Math.max(padding, Math.min(adjustedX, viewportWidth - menuWidth - padding));
      adjustedY = Math.max(padding, Math.min(adjustedY, viewportHeight - menuHeight - padding));

      setPosition({ x: adjustedX, y: adjustedY });
    }
  }, [shouldShowMenu, x, y]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    const handleScroll = () => {
      onClose();
    };

    if (shouldShowMenu) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEsc);
      window.addEventListener('scroll', handleScroll, true);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEsc);
      window.removeEventListener('scroll', handleScroll, true);
    };
  }, [shouldShowMenu, onClose]);

  if (!shouldShowMenu) return null;

  return (
    <div
      ref={menuRef}
      className="workspace-context-menu"
      style={{
        top: `${position.y}px`,
        left: `${position.x}px`,
        position: 'fixed',
        zIndex: 1000,
      }}
    >
      {/* Общие пункты меню (копировать, вставить и т.д.) */}
      {showCommonItems && (
        <>
          <button
            onClick={() => {
              onCopy();
              onClose();
            }}
            className="context-menu-item"
          >
            <span className="menu-icon">📋</span> Копировать
          </button>

          <button
            onClick={() => {
              onPaste();
              onClose();
            }}
            className="context-menu-item"
          >
            <span className="menu-icon">📝</span> Вставить
          </button>

          <button
            onClick={() => {
              onDuplicate();
              onClose();
            }}
            className="context-menu-item"
          >
            <span className="menu-icon">⎘</span> Дублировать
          </button>

          <button
            onClick={() => {
              onDelete();
              onClose();
            }}
            className="context-menu-item"
          >
            <span className="menu-icon">🗑️</span> Удалить
          </button>

          <div className="context-menu-divider" />
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
          >
            <span className="menu-icon">⬆️</span> На передний план
          </button>

          <button
            onClick={() => {
              onSendToBack();
              onClose();
            }}
            className="context-menu-item"
          >
            <span className="menu-icon">⬇️</span> На задний план
          </button>

          <div className="context-menu-divider" />
        </>
      )}

      {/* Фон слайда (только для слайда) */}
      {showSlideBackground && (
        <button
          onClick={() => {
            onChangeBackground();
            onClose();
          }}
          className="context-menu-item"
        >
          <span className="menu-icon">🎨</span> Фон слайда
        </button>
      )}

      {/* Цвет текста (только для текста) */}
      {showTextColor && (
        <button
          onClick={() => {
            onChangeTextColor();
            onClose();
          }}
          className="context-menu-item"
        >
          <span className="menu-icon">🅰️</span> Цвет текста
        </button>
      )}

      {/* Заливка (для текста и фигур) */}
      {showFill && (
        <button
          onClick={() => {
            onChangeFill();
            onClose();
          }}
          className="context-menu-item"
        >
          <span className="menu-icon">🎨</span> Заливка
        </button>
      )}

      {/* Границы (только для фигур) */}
      {(showBorderColor || showBorderWidth) && (
        <>
          {showBorderColor && (
            <button
              onClick={() => {
                onChangeBorderColor();
                onClose();
              }}
              className="context-menu-item"
            >
              <span className="menu-icon">🟦</span> Цвет границы
            </button>
          )}

          {showBorderWidth && (
            <button
              onClick={() => {
                onChangeBorderWidth();
                onClose();
              }}
              className="context-menu-item"
            >
              <span className="menu-icon">📏</span> Толщина границы
            </button>
          )}
        </>
      )}
    </div>
  );
}
