import React from 'react';
import { Slide, SlideElement } from '../../../../store/types/presentation';
import { useAppSelector } from '../../../../store/hooks';

interface Args {
  preview?: boolean;
  updateSlide: (updater: (s: Slide) => Slide) => void;
}

function snapToGrid(value: number, gridSize: number = 10): number {
  return Math.round(value / gridSize) * gridSize;
}

// Функция для получения масштаба контейнера
function getSlideContainerScale(): number {
  const slideContainer = document.querySelector('.slide-container');
  if (slideContainer) {
    const computedStyle = window.getComputedStyle(slideContainer);
    const matrix = new DOMMatrix(computedStyle.transform);
    return matrix.a || 1;
  }
  return 1;
}

export default function useResize({ preview, updateSlide }: Args) {
  const gridVisible = useAppSelector((state) => state.toolbar.gridVisible);

  const startResize = (
    e: React.PointerEvent,
    el: SlideElement,
    corner: 'nw' | 'ne' | 'sw' | 'se' | 'n' | 's' | 'e' | 'w'
  ) => {
    e.stopPropagation();
    if (preview) return;

    const MIN_WIDTH = 20;
    const MIN_HEIGHT = 20;
    const GRID_SIZE = 10;

    const startX = e.clientX;
    const startY = e.clientY;
    const origWidth = el.size.width;
    const origHeight = el.size.height;
    const origX = el.position.x;
    const origY = el.position.y;
    const aspectRatio = origWidth / origHeight; // Для сохранения пропорций с Shift

    let shiftPressed = false;

    const onKeyDown = (ev: KeyboardEvent) => {
      if (ev.key === 'Shift') shiftPressed = true;
    };

    const onKeyUp = (ev: KeyboardEvent) => {
      if (ev.key === 'Shift') shiftPressed = false;
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);

    const onPointerMove = (ev: PointerEvent) => {
      // Получаем масштаб и масштабируем дельты
      const scale = getSlideContainerScale();
      const dx = (ev.clientX - startX) / scale;
      const dy = (ev.clientY - startY) / scale;

      updateSlide((s: Slide) => ({
        ...s,
        elements: s.elements.map((item) => {
          if (item.id !== el.id) return item;

          let newWidth = origWidth;
          let newHeight = origHeight;
          let newX = origX;
          let newY = origY;

          const isCornerResize = ['nw', 'ne', 'sw', 'se'].includes(corner);

          if (shiftPressed && isCornerResize) {
            // Ресайз с сохранением пропорций (Shift)
            let scaleFactor;
            switch (corner) {
              case 'se':
                scaleFactor = Math.max(dx / origWidth, dy / origHeight);
                newWidth = origWidth * (1 + scaleFactor);
                newHeight = newWidth / aspectRatio;
                break;
              case 'sw':
                scaleFactor = Math.max(-dx / origWidth, dy / origHeight);
                newWidth = origWidth * (1 + scaleFactor);
                newHeight = newWidth / aspectRatio;
                newX = origX - (newWidth - origWidth);
                break;
              case 'ne':
                scaleFactor = Math.max(dx / origWidth, -dy / origHeight);
                newWidth = origWidth * (1 + scaleFactor);
                newHeight = newWidth / aspectRatio;
                newY = origY - (newHeight - origHeight);
                break;
              case 'nw':
                scaleFactor = Math.max(-dx / origWidth, -dy / origHeight);
                newWidth = origWidth * (1 + scaleFactor);
                newHeight = newWidth / aspectRatio;
                newX = origX - (newWidth - origWidth);
                newY = origY - (newHeight - origHeight);
                break;
            }
          } else {
            // Обычный ресайз (ваш старый код)
            switch (corner) {
              case 'se':
                newWidth = origWidth + dx;
                newHeight = origHeight + dy;
                break;
              case 'sw':
                newWidth = origWidth - dx;
                newHeight = origHeight + dy;
                newX = origX + dx;
                break;
              case 'ne':
                newWidth = origWidth + dx;
                newHeight = origHeight - dy;
                newY = origY + dy;
                break;
              case 'nw':
                newWidth = origWidth - dx;
                newHeight = origHeight - dy;
                newX = origX + dx;
                newY = origY + dy;
                break;
              case 'n':
                newHeight = origHeight - dy;
                newY = origY + dy;
                break;
              case 's':
                newHeight = origHeight + dy;
                break;
              case 'w':
                newWidth = origWidth - dx;
                newX = origX + dx;
                break;
              case 'e':
                newWidth = origWidth + dx;
                break;
            }
          }

          // Применяем минимальные размеры (ваш старый код)
          if (newWidth < MIN_WIDTH) {
            newWidth = MIN_WIDTH;
            if (['nw', 'w', 'sw'].includes(corner)) {
              newX = origX + (origWidth - MIN_WIDTH);
            } else {
              newX = origX;
            }
          }

          if (newHeight < MIN_HEIGHT) {
            newHeight = MIN_HEIGHT;
            if (['nw', 'n', 'ne'].includes(corner)) {
              newY = origY + (origHeight - MIN_HEIGHT);
            } else {
              newY = origY;
            }
          }

          // Применяем снаппинг только если сетка включена
          if (gridVisible) {
            newWidth = snapToGrid(newWidth, GRID_SIZE);
            newHeight = snapToGrid(newHeight, GRID_SIZE);
            newX = snapToGrid(newX, GRID_SIZE);
            newY = snapToGrid(newY, GRID_SIZE);
          }

          return {
            ...item,
            size: {
              width: Math.max(MIN_WIDTH, newWidth),
              height: Math.max(MIN_HEIGHT, newHeight),
            },
            position: { x: newX, y: newY },
          };
        }),
      }));
    };

    const onPointerUp = () => {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
    };

    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
  };

  return startResize;
}
