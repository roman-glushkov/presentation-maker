import React, { useRef, useCallback } from 'react';
import type { SlideElement, Slide } from '../../../../store/types/presentation';

interface DragArgs {
  preview?: boolean;
  setSelElId?: (id: string) => void;
  bringToFront?: (id: string) => void;
  updateSlide: (updater: (s: Slide) => Slide) => void;
  gridVisible?: boolean;
}

function snapToGrid(value: number, gridSize: number = 10): number {
  return Math.round(value / gridSize) * gridSize;
}

function getSlideContainerScale(): number {
  const slideContainer = document.querySelector('.slide-container');
  if (slideContainer) {
    const computedStyle = window.getComputedStyle(slideContainer);
    const matrix = new DOMMatrix(computedStyle.transform);
    return matrix.a || 1;
  }
  return 1;
}

function createPointerHandlers(onPointerMove: (ev: PointerEvent) => void, onPointerUp: () => void) {
  window.addEventListener('pointermove', onPointerMove);
  window.addEventListener('pointerup', onPointerUp);

  return () => {
    window.removeEventListener('pointermove', onPointerMove);
    window.removeEventListener('pointerup', onPointerUp);
  };
}

export default function useDrag({
  preview,
  setSelElId,
  bringToFront,
  updateSlide,
  gridVisible = false,
}: DragArgs) {
  const dragStateRef = useRef<{
    draggingIds: string[];
    startX: number;
    startY: number;
    origPositions: Map<string, { x: number; y: number }>;
    startScale: number;
  } | null>(null);

  const startDrag = useCallback(
    (
      e: React.PointerEvent,
      el: SlideElement,
      selectedElementIds: string[] = [],
      getAllElements: () => SlideElement[]
    ) => {
      if (preview) return;

      e.stopPropagation();

      const elementsToDrag = selectedElementIds.includes(el.id) ? selectedElementIds : [el.id];
      if (!selectedElementIds.includes(el.id)) setSelElId?.(el.id);
      elementsToDrag.forEach((id) => bringToFront?.(id));

      const allElements = getAllElements();
      const origPositions = new Map(
        allElements
          .filter((element) => elementsToDrag.includes(element.id))
          .map((element) => [
            element.id,
            {
              x: element.position.x,
              y: element.position.y,
            },
          ])
      );

      dragStateRef.current = {
        draggingIds: elementsToDrag,
        startX: e.clientX,
        startY: e.clientY,
        origPositions,
        startScale: getSlideContainerScale(),
      };

      const onPointerMove = (ev: PointerEvent) => {
        if (!dragStateRef.current) return;

        const currentScale = getSlideContainerScale();
        const scale = currentScale / dragStateRef.current.startScale;

        let dx = (ev.clientX - dragStateRef.current.startX) / scale;
        let dy = (ev.clientY - dragStateRef.current.startY) / scale;

        if (gridVisible) {
          dx = snapToGrid(dx);
          dy = snapToGrid(dy);
        }

        updateSlide((s) => ({
          ...s,
          elements: s.elements.map((item) => {
            if (!dragStateRef.current!.draggingIds.includes(item.id)) return item;
            const origPos = dragStateRef.current!.origPositions.get(item.id);

            if (!origPos) return item;

            let newX = origPos.x + dx;
            let newY = origPos.y + dy;

            if (gridVisible) {
              newX = snapToGrid(newX);
              newY = snapToGrid(newY);
            }

            return {
              ...item,
              position: {
                x: newX,
                y: newY,
              },
            };
          }),
        }));
      };

      const onPointerUp = () => {
        dragStateRef.current = null;
      };

      const cleanup = createPointerHandlers(onPointerMove, onPointerUp);

      return () => {
        cleanup();
      };
    },
    [preview, setSelElId, bringToFront, updateSlide, gridVisible]
  );

  return startDrag;
}
