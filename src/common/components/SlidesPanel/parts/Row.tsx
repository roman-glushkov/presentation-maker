// SlidesPanel/parts/Row.tsx
import React from 'react';
import { Slide } from '../../../../store/types/presentation';
import { Preview } from './Preview';
import { SlideNumber } from './Number';

interface RowProps {
  slide: Slide;
  index: number;
  scale: number;
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
  return (
    <div
      className={`slide-row ${selected ? 'selected' : ''} ${hovered ? 'hovered' : ''}`}
      draggable
      onClick={onClick}
      onDragStart={onDragStart}
      onDragEnter={onDragEnter}
      onDragEnd={onDragEnd}
      style={{
        cursor: 'pointer', // Добавляем курсор-указатель
        padding: '4px',
        margin: '4px 0',
        borderRadius: '4px',
        backgroundColor: selected ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
        transition: 'background-color 0.2s',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <SlideNumber number={index + 1} />
        <Preview slide={slide} scale={0.25} />
      </div>
    </div>
  );
}
