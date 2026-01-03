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
  if (!element) {
    return null;
  }
  const shadowFilterId = element.shadow ? `shape-shadow-${element.id}` : undefined;
  // Вспомогательные функции для создания фигур
  const renderShape = () => {
    const { width: w, height: h } = element.size;
    const sw = element.strokeWidth;
    const fill = element.fill;
    const stroke = element.stroke;
    const radius = Math.min(w, h) / 2;
    // Используем сглаживание для прямоугольников

    switch (element.shapeType) {
      case 'rectangle':
        return (
          <rect
            x={sw / 2}
            y={sw / 2}
            width={w - sw}
            height={h - sw}
            fill={fill}
            stroke={stroke}
            strokeWidth={sw}
          />
        );

      case 'circle':
        return (
          <circle
            cx={w / 2}
            cy={h / 2}
            r={radius - sw / 2}
            fill={fill}
            stroke={stroke}
            strokeWidth={sw}
          />
        );

      case 'triangle':
        return (
          <polygon
            points={`${sw},${h - sw} ${w / 2},${sw} ${w - sw},${h - sw}`}
            fill={fill}
            stroke={stroke}
            strokeWidth={sw}
            strokeLinejoin="round"
          />
        );

      case 'star': {
        const points = [];
        for (let i = 0; i < 10; i++) {
          const r = i % 2 === 0 ? radius * 0.6 : radius * 0.3;
          const angle = (Math.PI / 5) * i;
          points.push(`${w / 2 + r * Math.sin(angle)},${h / 2 + r * Math.cos(angle)}`);
        }
        return (
          <polygon
            points={points.join(' ')}
            fill={fill}
            stroke={stroke}
            strokeWidth={sw}
            strokeLinejoin="round"
          />
        );
      }

      case 'hexagon': {
        const points = [];
        for (let i = 0; i < 6; i++) {
          const angle = (Math.PI / 3) * i;
          points.push(`${w / 2 + radius * Math.sin(angle)},${h / 2 + radius * Math.cos(angle)}`);
        }
        return (
          <polygon
            points={points.join(' ')}
            fill={fill}
            stroke={stroke}
            strokeWidth={sw}
            strokeLinejoin="round"
          />
        );
      }

      case 'heart':
        return (
          <path
            d={`M ${w / 2} ${h * 0.3}
               Q ${w * 0.7} ${h * 0.1} ${w * 0.8} ${h * 0.3}
               Q ${w * 0.9} ${h * 0.5} ${w / 2} ${h * 0.8}
               Q ${w * 0.1} ${h * 0.5} ${w * 0.2} ${h * 0.3}
               Q ${w * 0.3} ${h * 0.1} ${w / 2} ${h * 0.3} Z`}
            fill={fill}
            stroke={stroke}
            strokeWidth={sw}
            strokeLinejoin="round"
          />
        );

      case 'cloud':
        return (
          <path
            d={`M ${w * 0.25} ${h * 0.6}
               C ${w * 0.15} ${h * 0.6} ${w * 0.15} ${h * 0.45} ${w * 0.28} ${h * 0.45}
               C ${w * 0.3} ${h * 0.3} ${w * 0.45} ${h * 0.28} ${w * 0.5} ${h * 0.4}
               C ${w * 0.58} ${h * 0.25} ${w * 0.78} ${h * 0.3} ${w * 0.78} ${h * 0.45}
               C ${w * 0.9} ${h * 0.48} ${w * 0.88} ${h * 0.65} ${w * 0.72} ${h * 0.65}
               H ${w * 0.28}
               C ${w * 0.26} ${h * 0.65} ${w * 0.25} ${h * 0.62} ${w * 0.25} ${h * 0.6} Z`}
            fill={fill}
            stroke={stroke}
            strokeWidth={sw}
            strokeLinejoin="round"
          />
        );

      case 'callout': {
        const bodyHeight = h - 16 - sw;
        const cx = w / 2;
        const r = 12;

        return (
          <path
            d={`M ${r} ${sw / 2}
               H ${w - r}
               Q ${w} ${sw / 2} ${w} ${r}
               V ${bodyHeight - r}
               Q ${w} ${bodyHeight} ${w - r} ${bodyHeight}
               H ${cx + 12}
               L ${cx} ${bodyHeight + 16}
               L ${cx - 12} ${bodyHeight}
               H ${r}
               Q ${sw / 2} ${bodyHeight} ${sw / 2} ${bodyHeight - r}
               V ${r}
               Q ${sw / 2} ${sw / 2} ${r} ${sw / 2} Z`}
            fill={fill}
            stroke={stroke}
            strokeWidth={sw}
            strokeLinejoin="round"
          />
        );
      }

      default:
        return (
          <rect
            x={sw / 2}
            y={sw / 2}
            width={w - sw}
            height={h - sw}
            fill={fill}
            stroke={stroke}
            strokeWidth={sw}
          />
        );
    }
  };

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
        cursor: preview ? 'default' : 'move',
        userSelect: 'none',
        padding: 0,
        boxSizing: 'border-box',
      }}
      data-type="shape"
    >
      <svg
        width={element.size.width}
        height={element.size.height}
        style={{ display: 'block', overflow: 'visible' }}
      >
        {element.shadow && (
          <defs>
            <filter id={shadowFilterId} x="-50%" y="-50%" width="200%" height="200%">
              <feDropShadow
                dx="0"
                dy="4"
                stdDeviation={element.shadow.blur / 2}
                floodColor={element.shadow.color}
              />
            </filter>
          </defs>
        )}

        <g filter={shadowFilterId ? `url(#${shadowFilterId})` : undefined}>{renderShape()}</g>
      </svg>

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
