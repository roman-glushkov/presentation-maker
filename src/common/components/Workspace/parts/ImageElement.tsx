import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../store';
import { updateSlide } from '../../../../store/editorSlice';
import {
  ImageElement as ImageElementType,
  SlideElement,
} from '../../../../store/types/presentation';
import ResizeHandle from './ResizeHandle';
import useDrag from '../hooks/useDrag';
import useResize from '../hooks/useResize';

interface Props {
  elementId: string;
  preview: boolean;
  selectedElementIds: string[];
  onElementClick: (e: React.MouseEvent, elementId: string) => void;
  getAllElements: () => SlideElement[];
}

export default function ImageElementView({
  elementId,
  preview,
  selectedElementIds,
  onElementClick,
  getAllElements,
}: Props) {
  const dispatch = useDispatch();
  const element = useSelector((state: RootState) => {
    const slide = state.editor.presentation.slides.find((s) =>
      s.elements.some((el) => el.id === elementId)
    );
    return slide?.elements.find((el) => el.id === elementId) as ImageElementType | undefined;
  });

  const isSelected = selectedElementIds.includes(elementId);

  const startDrag = useDrag({
    preview,
    setSelElId: () => {},
    bringToFront: () => {},
    updateSlide: (updater) => dispatch(updateSlide(updater)),
  });

  const startResize = useResize({
    preview,
    updateSlide: (updater) => dispatch(updateSlide(updater)),
  });

  if (!element || element.type !== 'image') return null;

  const handlePointerDown = (e: React.PointerEvent) => {
    startDrag(e, element, selectedElementIds, getAllElements);
  };

  // Стиль для тени
  const boxShadowStyle = element.shadow
    ? `0 4px ${element.shadow.blur}px ${element.shadow.color}`
    : 'none';

  return (
    <div
      className={`element ${isSelected ? 'selected' : ''}`}
      onClick={(e) => onElementClick(e, elementId)}
      onPointerDown={handlePointerDown}
      style={{
        position: 'absolute',
        left: element.position.x,
        top: element.position.y,
        width: element.size.width,
        height: element.size.height,
        cursor: preview ? 'default' : 'grab',
        userSelect: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        pointerEvents: 'auto',
        border: isSelected && !preview ? '2px solid #3b82f6' : '1px solid #d1d5db',
        // ПРИМЕНЯЕМ ТЕНЬ И СГЛАЖИВАНИЕ
        boxShadow: boxShadowStyle,
        borderRadius: element.smoothing ? `${element.smoothing}px` : '0',
        overflow: 'hidden',
      }}
    >
      <img
        src={element.src}
        alt="Изображение"
        draggable={false}
        style={{
          width: element.size.width === 0 ? 'auto' : '100%',
          height: element.size.height === 0 ? 'auto' : '100%',
          objectFit: 'fill',
          userSelect: 'none',
          borderRadius: element.smoothing ? `${element.smoothing}px` : '0',
        }}
      />
      {isSelected && !preview && (
        <>
          {(['nw', 'ne', 'sw', 'se', 'n', 's', 'e', 'w'] as const).map((c) => (
            <ResizeHandle key={c} corner={c} onPointerDown={(e) => startResize(e, element, c)} />
          ))}
        </>
      )}
    </div>
  );
}
