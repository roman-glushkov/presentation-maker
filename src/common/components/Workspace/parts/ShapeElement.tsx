import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../store';
import { updateSlide } from '../../../../store/editorSlice';
import {
  ShapeElement as ShapeElementType,
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

export default function ShapeElementView({
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
    return slide?.elements.find((el) => el.id === elementId) as ShapeElementType | undefined;
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

  if (!element || element.type !== 'shape') return null;

  const handlePointerDown = (e: React.PointerEvent) => {
    startDrag(e, element, selectedElementIds, getAllElements);
  };

  // Функция для получения стилей формы
  const getShapeStyles = () => {
    const baseStyles = {
      position: 'absolute',
      left: element.position.x,
      top: element.position.y,
      width: element.size.width,
      height: element.size.height,
      backgroundColor: element.fill,
      border: `${element.strokeWidth}px solid ${element.stroke}`,
      cursor: preview ? 'default' : 'grab',
      userSelect: 'none',
      pointerEvents: 'auto',
      boxSizing: 'border-box' as const,
    };

    switch (element.shapeType) {
      case 'circle':
        return {
          ...baseStyles,
          borderRadius: '50%',
        };
      case 'triangle':
        return {
          ...baseStyles,
          backgroundColor: 'transparent',
          border: 'none',
          clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
          background: element.fill,
        };
      case 'star':
        return {
          ...baseStyles,
          clipPath:
            'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)',
        };
      case 'heart':
        return {
          ...baseStyles,
          clipPath:
            'path("M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z")',
        };
      case 'line':
        return {
          ...baseStyles,
          width: Math.max(element.size.width, element.strokeWidth),
          height: Math.max(element.size.height, element.strokeWidth),
          backgroundColor: element.stroke,
          border: 'none',
          transform: `rotate(${Math.atan2(element.size.height, element.size.width)}rad)`,
        };
      case 'arrow':
        return {
          ...baseStyles,
          position: 'absolute',
          borderLeft: `${element.size.height / 2}px solid transparent`,
          borderRight: `${element.size.height / 2}px solid transparent`,
          borderBottom: `${element.size.width}px solid ${element.fill}`,
          backgroundColor: 'transparent',
          border: 'none',
          width: 0,
          height: 0,
        };
      case 'rectangle':
      default:
        return {
          ...baseStyles,
          borderRadius: element.borderRadius ? `${element.borderRadius}px` : '0',
        };
    }
  };

  return (
    <div
      className={`element ${isSelected ? 'selected' : ''}`}
      onClick={(e) => onElementClick(e, elementId)}
      onPointerDown={handlePointerDown}
      style={{
        ...getShapeStyles(),
        border: isSelected && !preview ? '2px solid #3b82f6' : undefined,
      }}
    >
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
