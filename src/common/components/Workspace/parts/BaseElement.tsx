import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../store';
import { updateSlide } from '../../../../store/editorSlice';
import { SlideElement } from '../../../../store/types/presentation';
import ResizeHandle from './ResizeHandle';
import useDrag from '../hooks/useDrag';
import useResize from '../hooks/useResize';

import '../styles/BaseElement.css';
import '../styles/ResizeHandle.css';

interface BaseElementProps {
  elementId: string;
  preview: boolean;
  selectedElementIds: string[];
  onElementClick: (e: React.MouseEvent, elementId: string) => void;
  getAllElements: () => SlideElement[];
  children: (element: SlideElement, isSelected: boolean) => React.ReactNode;
  elementType: 'text' | 'image' | 'shape';
}

export function BaseElement({
  elementId,
  preview,
  selectedElementIds,
  onElementClick,
  getAllElements,
  children,
  elementType,
}: BaseElementProps) {
  const dispatch = useDispatch();

  const element = useSelector((state: RootState) => {
    const slide = state.editor.presentation.slides.find((s) =>
      s.elements.some((el) => el.id === elementId)
    );
    return slide?.elements.find((el) => el.id === elementId);
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

  if (!element || element.type !== elementType) return null;

  const handlePointerDown = (e: React.PointerEvent) => {
    // Простая проверка - если клик по textarea, не начинаем drag
    const target = e.target as HTMLElement;
    if (target.tagName === 'TEXTAREA' || target.closest('textarea')) {
      return;
    }
    startDrag(e, element, selectedElementIds, getAllElements);
  };

  const handleResizeStart = (
    e: React.PointerEvent,
    corner: 'nw' | 'ne' | 'sw' | 'se' | 'n' | 's' | 'e' | 'w'
  ) => {
    startResize(e, element, corner);
  };

  const handleClick = (e: React.MouseEvent) => {
    onElementClick(e, elementId);
  };

  const elementStyle: React.CSSProperties = {
    position: 'absolute',
    left: element.position.x,
    top: element.position.y,
    width: element.size.width,
    height: element.size.height,
    cursor: preview ? 'default' : 'move',
    userSelect: 'none',
  };

  return (
    <div
      className={`element ${elementType}-element ${isSelected ? 'selected' : ''}`}
      onClick={handleClick}
      onPointerDown={handlePointerDown}
      style={elementStyle}
      data-type={elementType}
    >
      {children(element, isSelected)}

      {isSelected && !preview && (
        <>
          {(['nw', 'ne', 'sw', 'se', 'n', 's', 'e', 'w'] as const).map((corner) => (
            <ResizeHandle
              key={corner}
              corner={corner}
              onPointerDown={(e) => handleResizeStart(e, corner)}
            />
          ))}
        </>
      )}
    </div>
  );
}

export function createElementComponent<T extends SlideElement>(
  elementType: T['type'],
  renderContent: (element: T, isSelected: boolean) => React.ReactNode
) {
  return function ElementComponent(props: Omit<BaseElementProps, 'children' | 'elementType'>) {
    return (
      <BaseElement
        {...props}
        elementType={elementType}
        children={(element, isSelected) => renderContent(element as T, isSelected)}
      />
    );
  };
}
