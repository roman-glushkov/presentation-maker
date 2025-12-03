import React from 'react';

interface Props {
  corner: 'nw' | 'ne' | 'sw' | 'se' | 'n' | 's' | 'e' | 'w';
  onPointerDown: (e: React.PointerEvent) => void;
}

export default function ResizeHandle({ corner, onPointerDown }: Props) {
  return (
    <div
      className={`resize-handle ${corner}`}
      onPointerDown={(e) => {
        e.stopPropagation();
        onPointerDown(e);
      }}
    />
  );
}
