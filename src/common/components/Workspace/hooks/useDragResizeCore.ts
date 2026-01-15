import React from 'react';
import type { Slide } from '../../../../store/types/presentation';
import { useAppSelector } from '../../../../store/hooks';

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

export function snapToGrid(value: number, gridSize: number = 10): number {
  return Math.round(value / gridSize) * gridSize;
}

// Функция для получения текущего масштаба контейнера
function getSlideContainerScale(): number {
  const slideContainer = document.querySelector('.slide-container');
  if (slideContainer) {
    const computedStyle = window.getComputedStyle(slideContainer);
    const matrix = new DOMMatrix(computedStyle.transform);
    // matrix.a - масштаб по X (scale factor)
    return matrix.a || 1;
  }
  return 1;
}

export function useDragResizeCore({ preview, updateSlide }: DragResizeCoreArgs) {
  const gridVisible = useAppSelector((state) => state.toolbar.gridVisible);

  const handlePointerEvent = (
    e: React.PointerEvent,
    callback: (dx: number, dy: number) => void
  ) => {
    e.stopPropagation();
    if (preview) return;

    const startX = e.clientX;
    const startY = e.clientY;

    const onPointerMove = (ev: PointerEvent) => {
      const currentScale = getSlideContainerScale();
      const scale = currentScale; // Используем текущий масштаб

      // Масштабируем дельты координат мыши
      const dx = (ev.clientX - startX) / scale;
      const dy = (ev.clientY - startY) / scale;

      const snappedDx = gridVisible ? snapToGrid(dx) : dx;
      const snappedDy = gridVisible ? snapToGrid(dy) : dy;

      callback(snappedDx, snappedDy);
    };

    return createPointerHandlers(onPointerMove, () => {});
  };

  return { handlePointerEvent, updateSlide, gridVisible };
}
