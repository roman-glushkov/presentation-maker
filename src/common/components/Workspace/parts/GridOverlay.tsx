import React from 'react';
import { useAppSelector } from '../../../../store/hooks';
import '../styles/GridOverlay.css';

export default function GridOverlay() {
  const gridVisible = useAppSelector((state) => state.toolbar.gridVisible);

  if (!gridVisible) {
    return null;
  }

  return (
    <div
      className="grid-overlay"
      style={{
        backgroundImage: `
          linear-gradient(to right, rgba(0, 0, 0, 0.08) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(0, 0, 0, 0.08) 1px, transparent 1px)
        `,
        backgroundSize: '10px 10px',
      }}
    />
  );
}
