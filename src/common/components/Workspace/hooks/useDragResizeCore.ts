import React from 'react';
import type { Slide } from '../../../../store/types/presentation';

type UpdateSlideFn = (updater: (s: Slide) => Slide) => void;

interface DragResizeCoreArgs {
  preview?: boolean;
  updateSlide: UpdateSlideFn;
}

export function createPointerHandlers(
  onPointerMove: (ev: PointerEvent) => void,
  onPointerUp: () => void
) {
  window.addEventListener('pointermove', onPointerMove);
  window.addEventListener('pointerup', onPointerUp);

  return () => {
    window.removeEventListener('pointermove', onPointerMove);
    window.removeEventListener('pointerup', onPointerUp);
  };
}

// Функция для прилипания к сетке (10px)
export function snapToGrid(value: number, gridSize: number = 10): number {
  return Math.round(value / gridSize) * gridSize;
}

export function useDragResizeCore({ preview, updateSlide }: DragResizeCoreArgs) {
  const handlePointerEvent = (
    e: React.PointerEvent,
    callback: (dx: number, dy: number) => void
  ) => {
    e.stopPropagation();
    if (preview) return;

    const startX = e.clientX;
    const startY = e.clientY;

    const onPointerMove = (ev: PointerEvent) => {
      const dx = ev.clientX - startX;
      const dy = ev.clientY - startY;

      // Снаппинг к сетке
      const snappedDx = snapToGrid(dx);
      const snappedDy = snapToGrid(dy);

      // Передаем снапнутые значения
      callback(snappedDx, snappedDy);
    };

    return createPointerHandlers(onPointerMove, () => {});
  };

  return { handlePointerEvent, updateSlide };
}
