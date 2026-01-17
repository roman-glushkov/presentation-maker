import React from 'react';
import { Slide } from '../../../../store/types/presentation';
import { PreviewWorkspace } from './PreviewWorkspace';

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

function SlideNumber({ number }: { number: number }) {
  return <div className="slide-number">{number}</div>;
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
      <PreviewWorkspace slide={slide} />
    </div>
  );
}
