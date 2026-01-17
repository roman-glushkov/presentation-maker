import React from 'react';
import './styles/ColorSwatchButton.css';

interface Props {
  color: string;
  onClick: (color: string) => void;
  title?: string;
  ariaLabel?: string;
}

export default function ColorSwatchButton({ color, onClick, title, ariaLabel }: Props) {
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClick(color);
  };

  const className = `color-swatch ${color === '#ffffff' ? 'color-swatch-white' : ''}`;

  return (
    <button
      className={className}
      onClick={handleClick}
      title={title || color}
      aria-label={ariaLabel || title || color}
      style={{ backgroundColor: color }}
    />
  );
}
