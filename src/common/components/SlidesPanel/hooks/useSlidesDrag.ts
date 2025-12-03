import { useState, useEffect, useRef } from 'react';
import { Slide } from '../../../../store/types/presentation';

interface UseSlidesLogicArgs {
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
}: UseSlidesLogicArgs) {
  const [localSlides, setLocalSlides] = useState(slides);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  const initialSlidesRef = useRef<Slide[]>([]);

  useEffect(() => {
    setLocalSlides(slides);
  }, [slides]);

  const handleDragStart = (index: number) => {
    const slideId = localSlides[index].id;

    if (!selectedSlideIds.includes(slideId)) {
      setSelectedSlideIds([slideId]);
    }

    setDragIndex(index);
    initialSlidesRef.current = [...slides];
  };

  const handleDragEnter = (index: number) => {
    setHoverIndex(index);

    if (dragIndex === null || dragIndex === index) return;

    const updated = [...localSlides];
    const newDragIndex = index;

    if (selectedSlideIds.length > 1) {
      // Мультивыделение
      const selectedIndexes = updated
        .map((slide, idx) => (selectedSlideIds.includes(slide.id) ? idx : -1))
        .filter((idx) => idx !== -1)
        .sort((a, b) => a - b);

      const draggedSlides = selectedIndexes.map((idx) => updated[idx]);
      const filteredSlides = updated.filter((_, idx) => !selectedIndexes.includes(idx));

      let insertPosition = newDragIndex;
      const firstSelectedIndex = selectedIndexes[0];

      if (firstSelectedIndex < newDragIndex) {
        insertPosition = newDragIndex - selectedIndexes.length + 1;
      } else {
        insertPosition = newDragIndex;
      }

      filteredSlides.splice(insertPosition, 0, ...draggedSlides);
      setLocalSlides(filteredSlides);
      setDragIndex(newDragIndex);
    } else {
      // Одиночное перетаскивание
      const [movedSlide] = updated.splice(dragIndex, 1);
      updated.splice(newDragIndex, 0, movedSlide);
      setLocalSlides(updated);
      setDragIndex(newDragIndex);
    }
  };

  const handleDragEnd = () => {
    if (dragIndex === null || hoverIndex === null) {
      setDragIndex(null);
      setHoverIndex(null);
      return;
    }

    // Проверяем, изменился ли порядок слайдов
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
  };

  return {
    localSlides,
    hoverIndex,
    handleDragStart,
    handleDragEnter,
    handleDragEnd,
  };
}
