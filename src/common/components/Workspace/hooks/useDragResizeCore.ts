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
      callback(ev.clientX - startX, ev.clientY - startY);
    };

    return createPointerHandlers(onPointerMove, () => {});
  };

  return { handlePointerEvent, updateSlide };
}
