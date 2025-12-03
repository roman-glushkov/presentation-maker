import React from 'react';

interface Props {
  color: string;
  onClick: (color: string) => void;
  title?: string;
}

export default function ThemeColorButton({ color, onClick, title }: Props) {
  return (
    <button
      className="color-swatch"
      style={{ backgroundColor: color }}
      onClick={() => onClick(color)}
      title={title || color}
      aria-label={title || color}
    />
  );
}
