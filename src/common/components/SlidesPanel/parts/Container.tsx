import React, { useEffect, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '../../../../store/hooks';
import { selectSlide, selectSlides, reorderSlides } from '../../../../store/editorSlice';
import { SlideRow } from './Row';
import { useSlidesDrag } from '../hooks/useSlidesDrag';

export default function SlidesContainer() {
  const dispatch = useAppDispatch();
  const slides = useAppSelector((state) => state.editor.presentation.slides);
  const selectedSlideIds = useAppSelector((state) => state.editor.selectedSlideIds);

  const setSelectedSlideIds = (ids: string[]) => {
    dispatch(selectSlides(ids));
  };

  const { localSlides, hoverIndex, handleDragStart, handleDragEnter, handleDragEnd } =
    useSlidesDrag({
      slides,
      selectedSlideIds,
      setSelectedSlideIds,
      onSlidesReorder: (newOrder) => {
        dispatch(reorderSlides(newOrder));
      },
    });

  const slideRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const selectedSlideId = selectedSlideIds[0];

  useEffect(() => {
    if (selectedSlideId) {
      const ref = slideRefs.current[selectedSlideId];
      if (ref) {
        ref.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
      }
    }
  }, [selectedSlideId]);

  const handleSlideClick = (slideId: string, multi: boolean) => {
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
  };

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
            scale={0.25}
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
