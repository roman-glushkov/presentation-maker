import React, { useEffect, useRef, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../../../../store/hooks';
import { selectSlide, selectSlides, reorderSlides } from '../../../../store/editorSlice';
import { SlideRow } from './Row';
import { useSlidesDrag } from '../hooks/useSlidesDrag';

export default function SlidesContainer() {
  const dispatch = useAppDispatch();
  const slides = useAppSelector((state) => state.editor.presentation.slides);
  const selectedSlideIds = useAppSelector((state) => state.editor.selectedSlideIds);
  const selectedSlideId = selectedSlideIds[0];
  const slideRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const setSelectedSlideIds = useCallback(
    (ids: string[]) => dispatch(selectSlides(ids)),
    [dispatch]
  );

  const { localSlides, hoverIndex, handleDragStart, handleDragEnter, handleDragEnd } =
    useSlidesDrag({
      slides,
      selectedSlideIds,
      setSelectedSlideIds,
      onSlidesReorder: (newOrder) => dispatch(reorderSlides(newOrder)),
    });

  useEffect(() => {
    if (selectedSlideId) {
      const ref = slideRefs.current[selectedSlideId];
      ref?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [selectedSlideId]);

  const handleSlideClick = useCallback(
    (slideId: string, multi: boolean) => {
      if (multi) {
        if (selectedSlideIds.includes(slideId)) {
          if (selectedSlideIds.length > 1) {
            setSelectedSlideIds(selectedSlideIds.filter((id) => id !== slideId));
          }
        } else {
          setSelectedSlideIds([...selectedSlideIds, slideId]);
        }
      } else {
        dispatch(selectSlide(slideId));
      }
    },
    [selectedSlideIds, setSelectedSlideIds, dispatch]
  );

  return (
    <div className="slides-container">
      {localSlides.map((slide, index) => (
        <div
          key={slide.id}
          ref={(el) => {
            slideRefs.current[slide.id] = el;
          }}
        >
          <SlideRow
            slide={slide}
            index={index}
            selected={selectedSlideIds.includes(slide.id)}
            hovered={index === hoverIndex}
            onClick={(e) => handleSlideClick(slide.id, e.ctrlKey || e.metaKey)}
            onDragStart={() => handleDragStart(index)}
            onDragEnter={() => handleDragEnter(index)}
            onDragEnd={handleDragEnd}
          />
        </div>
      ))}
    </div>
  );
}
