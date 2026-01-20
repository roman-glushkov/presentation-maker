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
