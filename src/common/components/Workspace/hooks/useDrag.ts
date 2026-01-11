import React from 'react';
import { useRef } from 'react';
import { useDragResizeCore, createPointerHandlers } from './useDragResizeCore';
import type { SlideElement } from '../../../../store/types/presentation';

interface DragArgs {
  preview?: boolean;
  setSelElId?: (id: string) => void;
  bringToFront?: (id: string) => void;
  updateSlide: Parameters<typeof useDragResizeCore>[0]['updateSlide'];
}

export default function useDrag({ preview, setSelElId, bringToFront, updateSlide }: DragArgs) {
  const { handlePointerEvent } = useDragResizeCore({ preview, updateSlide });
  const dragStateRef = useRef<{
    draggingIds: string[];
    startX: number;
    startY: number;
    origPositions: Map<string, { x: number; y: number }>;
  } | null>(null);

  return (
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
        .map((element) => [element.id, { x: element.position.x, y: element.position.y }])
    );

    dragStateRef.current = {
      draggingIds: elementsToDrag,
      startX: e.clientX,
      startY: e.clientY,
      origPositions,
    };

    const cleanup = handlePointerEvent(e, (dx, dy) => {
      if (!dragStateRef.current) return;

      updateSlide((s) => ({
        ...s,
        elements: s.elements.map((item) => {
          if (!dragStateRef.current!.draggingIds.includes(item.id)) return item;
          const origPos = dragStateRef.current!.origPositions.get(item.id);
          return origPos ? { ...item, position: { x: origPos.x + dx, y: origPos.y + dy } } : item;
        }),
      }));
    });

    const cleanupPointerHandlers = createPointerHandlers(
      () => {},
      () => {
        dragStateRef.current = null;
        if (cleanup) cleanup();
      }
    );

    return () => {
      cleanupPointerHandlers();
    };
  };
}
