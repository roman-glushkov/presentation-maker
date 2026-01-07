import React from 'react';
import { Slide } from '../../../../store/types/presentation';
import { PreviewWorkspace } from './PreviewWorkspace';
import { SlideNumber } from './Number';

interface RowProps {
  slide: Slide;
  index: number;
  selected: boolean;
  hovered: boolean;
  onClick: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  onDragStart: () => void;
  onDragEnter: () => void;
  onDragEnd: () => void;
}

export function SlideRow({
  slide,
  index,
  selected,
  hovered,
  onClick,
  onDragStart,
  onDragEnter,
  onDragEnd,
}: RowProps) {
  const rowClass = `slide-row ${selected ? 'selected' : ''} ${hovered ? 'hovered' : ''}`;

  return (
    <div
      className={rowClass}
      draggable
      onClick={onClick}
      onDragStart={onDragStart}
      onDragEnter={onDragEnter}
      onDragEnd={onDragEnd}
    >
      <SlideNumber number={index + 1} />
      <PreviewWorkspace slide={slide} scale={0.25} />
    </div>
  );
}
