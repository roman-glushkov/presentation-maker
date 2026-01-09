import React from 'react';

import '../styles/ResizeHandle.css';

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
