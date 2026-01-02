// C:\PGTU\FRONT-end\presentation maker\src\common\components\Workspace\parts\ColorSwatchButton.tsx
import React from 'react';

interface Props {
  color: string;
  onClick: (color: string) => void;
  title?: string;
}

export default function ColorSwatchButton({ color, onClick, title }: Props) {
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    console.log('🎯 ColorSwatchButton кликнут:', color);
    onClick(color);
  };

  return (
    <button
      className="color-swatch"
      style={{
        width: '22px',
        height: '22px',
        backgroundColor: color,
        border: color === '#ffffff' ? '1px solid #ccc' : '1px solid rgba(255,255,255,0.25)',
        borderRadius: '3px',
        cursor: 'pointer',
        padding: 0,
        boxShadow: '0 1px 2px rgba(0,0,0,0.3)',
        transition: 'transform 0.12s ease, box-shadow 0.12s ease, border-color 0.12s ease',
      }}
      onClick={handleClick}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'scale(1.25)';
        e.currentTarget.style.borderColor = '#fff';
        e.currentTarget.style.boxShadow = '0 0 8px rgba(255,255,255,0.45)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'scale(1)';
        e.currentTarget.style.borderColor = color === '#ffffff' ? '#ccc' : 'rgba(255,255,255,0.25)';
        e.currentTarget.style.boxShadow = '0 1px 2px rgba(0,0,0,0.3)';
      }}
      title={title || color}
    />
  );
}
