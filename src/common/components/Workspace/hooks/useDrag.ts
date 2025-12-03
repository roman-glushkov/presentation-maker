import React from 'react';
import { useRef } from 'react';
import type { Slide, SlideElement } from '../../../../store/types/presentation';

type UpdateSlideFn = (updater: (s: Slide) => Slide) => void;

interface Args {
  preview?: boolean;
  setSelElId?: (id: string) => void;
  bringToFront?: (id: string) => void;
  updateSlide: UpdateSlideFn;
}

export default function useDrag({ preview, setSelElId, bringToFront, updateSlide }: Args) {
  const dragStateRef = useRef<{
    draggingIds: string[];
    startX: number;
    startY: number;
    origPositions: Map<string, { x: number; y: number }>;
    raf?: number;
  } | null>(null);

  const startDrag = (
    e: React.PointerEvent,
    el: SlideElement,
    selectedElementIds: string[] = [],
    getAllElements: () => SlideElement[]
  ) => {
    if (preview) return;
    e.stopPropagation();

    const elementsToDrag = selectedElementIds.includes(el.id) ? selectedElementIds : [el.id];

    if (!selectedElementIds.includes(el.id)) {
      setSelElId?.(el.id);
    }

    elementsToDrag.forEach((id) => bringToFront?.(id));

    const allElements = getAllElements();
    const origPositions = new Map();

    allElements.forEach((element) => {
      if (elementsToDrag.includes(element.id)) {
        origPositions.set(element.id, {
          x: element.position.x,
          y: element.position.y,
        });
      }
    });

    const ds = {
      draggingIds: elementsToDrag,
      startX: e.clientX,
      startY: e.clientY,
      origPositions,
    };
    dragStateRef.current = ds;

    const onPointerMove = (ev: PointerEvent) => {
      const cur = dragStateRef.current;
      if (!cur) return;

      const dx = ev.clientX - cur.startX;
      const dy = ev.clientY - cur.startY;

      if (cur.raf) cancelAnimationFrame(cur.raf);
      cur.raf = requestAnimationFrame(() => {
        updateSlide((s: Slide) => ({
          ...s,
          elements: s.elements.map((item) => {
            if (cur.draggingIds.includes(item.id)) {
              const origPos = cur.origPositions.get(item.id);
              if (origPos) {
                return {
                  ...item,
                  position: {
                    x: origPos.x + dx,
                    y: origPos.y + dy,
                  },
                };
              }
            }
            return item;
          }),
        }));
      });
    };

    const onPointerUp = () => {
      if (dragStateRef.current?.raf) cancelAnimationFrame(dragStateRef.current.raf);
      dragStateRef.current = null;
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
    };

    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
  };

  return startDrag;
}
