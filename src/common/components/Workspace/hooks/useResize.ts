import React from 'react';
import { Slide, SlideElement } from '../../../../store/types/presentation';

interface Args {
  preview?: boolean;
  updateSlide: (updater: (s: Slide) => Slide) => void;
}

function snapToGrid(value: number, gridSize: number = 10): number {
  return Math.round(value / gridSize) * gridSize;
}

export default function useResize({ preview, updateSlide }: Args) {
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

    const onPointerMove = (ev: PointerEvent) => {
      let dx = ev.clientX - startX;
      let dy = ev.clientY - startY;

      dx = snapToGrid(dx, GRID_SIZE);
      dy = snapToGrid(dy, GRID_SIZE);

      updateSlide((s: Slide) => ({
        ...s,
        elements: s.elements.map((item) => {
          if (item.id !== el.id) return item;

          let newWidth = origWidth;
          let newHeight = origHeight;
          let newX = origX;
          let newY = origY;

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
          newWidth = Math.max(MIN_WIDTH, snapToGrid(newWidth, GRID_SIZE));
          newHeight = Math.max(MIN_HEIGHT, snapToGrid(newHeight, GRID_SIZE));
          newX = snapToGrid(newX, GRID_SIZE);
          newY = snapToGrid(newY, GRID_SIZE);

          if (['nw', 'w', 'sw'].includes(corner) && newWidth < MIN_WIDTH) {
            newX = origX + (origWidth - MIN_WIDTH);
          }

          if (['nw', 'n', 'ne'].includes(corner) && newHeight < MIN_HEIGHT) {
            newY = origY + (origHeight - MIN_HEIGHT);
          }

          return {
            ...item,
            size: { width: newWidth, height: newHeight },
            position: { x: newX, y: newY },
          };
        }),
      }));
    };

    const onPointerUp = () => {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
    };

    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
  };

  return startResize;
}
