import React from 'react';
import { Slide, SlideElement } from '../../../../store/types/presentation';

interface Args {
  preview?: boolean;
  updateSlide: (updater: (s: Slide) => Slide) => void;
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

    const startX = e.clientX;
    const startY = e.clientY;
    const origWidth = el.size.width;
    const origHeight = el.size.height;
    const origX = el.position.x;
    const origY = el.position.y;

    const onPointerMove = (ev: PointerEvent) => {
      const dx = ev.clientX - startX;
      const dy = ev.clientY - startY;

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
