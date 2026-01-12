import React from 'react';
import '../styles/GridOverlay.css';

export default function GridOverlay() {
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
