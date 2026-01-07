import { useState, useEffect, useRef, useCallback } from 'react';
import { Slide } from '../../../../store/types/presentation';

interface UseSlidesDragArgs {
  slides: Slide[];
  selectedSlideIds: string[];
  setSelectedSlideIds: (ids: string[]) => void;
  onSlidesReorder?: (newOrder: Slide[]) => void;
}

export function useSlidesDrag({
  slides,
  selectedSlideIds,
  setSelectedSlideIds,
  onSlidesReorder,
}: UseSlidesDragArgs) {
  const [localSlides, setLocalSlides] = useState(slides);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const initialSlidesRef = useRef<Slide[]>([]);

  useEffect(() => {
    setLocalSlides(slides);
  }, [slides]);

  const reorderSlides = useCallback(
    (fromIndex: number, toIndex: number) => {
      const updated = [...localSlides];

      if (selectedSlideIds.length > 1) {
        const selectedIndexes = updated
          .map((slide, idx) => (selectedSlideIds.includes(slide.id) ? idx : -1))
          .filter((idx) => idx !== -1)
          .sort((a, b) => a - b);

        const draggedSlides = selectedIndexes.map((idx) => updated[idx]);
        const filteredSlides = updated.filter((_, idx) => !selectedIndexes.includes(idx));

        let insertPosition = toIndex;
        const firstSelectedIndex = selectedIndexes[0];

        if (firstSelectedIndex < toIndex) {
          insertPosition = toIndex - selectedIndexes.length + 1;
        }

        filteredSlides.splice(insertPosition, 0, ...draggedSlides);
        setLocalSlides(filteredSlides);
      } else {
        const [movedSlide] = updated.splice(fromIndex, 1);
        updated.splice(toIndex, 0, movedSlide);
        setLocalSlides(updated);
      }
    },
    [localSlides, selectedSlideIds]
  );

  const handleDragStart = useCallback(
    (index: number) => {
      const slideId = localSlides[index].id;

      if (!selectedSlideIds.includes(slideId)) {
        setSelectedSlideIds([slideId]);
      }

      setDragIndex(index);
      initialSlidesRef.current = [...slides];
    },
    [localSlides, selectedSlideIds, setSelectedSlideIds, slides]
  );

  const handleDragEnter = useCallback(
    (index: number) => {
      setHoverIndex(index);

      if (dragIndex === null || dragIndex === index) return;
      reorderSlides(dragIndex, index);
      setDragIndex(index);
    },
    [dragIndex, reorderSlides]
  );

  const handleDragEnd = useCallback(() => {
    if (dragIndex === null || hoverIndex === null) {
      setDragIndex(null);
      setHoverIndex(null);
      return;
    }

    const hasOrderChanged =
      JSON.stringify(initialSlidesRef.current.map((s) => s.id)) !==
      JSON.stringify(localSlides.map((s) => s.id));

    if (hasOrderChanged) {
      onSlidesReorder?.(localSlides);
    } else {
      setLocalSlides([...initialSlidesRef.current]);
    }

    setDragIndex(null);
    setHoverIndex(null);
    initialSlidesRef.current = [];
  }, [dragIndex, hoverIndex, localSlides, onSlidesReorder]);

  return {
    localSlides,
    hoverIndex,
    handleDragStart,
    handleDragEnter,
    handleDragEnd,
  };
}
