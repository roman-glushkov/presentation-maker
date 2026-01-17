import React from 'react';
import { Slide } from '../../store/types/presentation';

export const getSlideBackgroundStyle = (slide: Slide): React.CSSProperties => {
  const bg = slide.background;

  switch (bg.type) {
    case 'image':
      return {
        backgroundImage: `url(${bg.value})`,
        backgroundSize: bg.size || 'cover',
        backgroundPosition: bg.position || 'center',
        backgroundRepeat: 'no-repeat',
      };
    case 'color':
      return { backgroundColor: bg.value };
    default:
      return { backgroundColor: '#ffffff' };
  }
};

export const getScaledSlideBackgroundStyle = (
  slide: Slide,
  scale: number = 1
): React.CSSProperties => {
  const baseStyle = getSlideBackgroundStyle(slide);

  if (scale === 1) return baseStyle;

  // Масштабируем свойства, если нужно
  const scaledStyle = { ...baseStyle };

  if (scaledStyle.backgroundSize && typeof scaledStyle.backgroundSize === 'string') {
    if (scaledStyle.backgroundSize.includes('px')) {
      const size = parseFloat(scaledStyle.backgroundSize);
      scaledStyle.backgroundSize = `${size * scale}px`;
    }
  }

  return scaledStyle;
};
