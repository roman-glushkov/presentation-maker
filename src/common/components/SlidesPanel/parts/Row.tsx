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
  const rowStyle = {
    cursor: 'pointer',
    padding: '4px',
    margin: '4px 0',
    borderRadius: '4px',
    backgroundColor: selected ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
    transition: 'background-color 0.2s',
  };

  return (
    <div
      className={rowClass}
      draggable
      onClick={onClick}
      onDragStart={onDragStart}
      onDragEnter={onDragEnter}
      onDragEnd={onDragEnd}
      style={rowStyle}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <SlideNumber number={index + 1} />
        <PreviewWorkspace slide={slide} scale={0.25} />
      </div>
    </div>
  );
}
