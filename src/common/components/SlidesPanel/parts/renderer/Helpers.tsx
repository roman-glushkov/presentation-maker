import React from 'react';
import { Background } from '../../../../../store/types/presentation';

export const getShadowStyle = (shadow?: { color: string; blur: number }, scale = 1) => {
  if (!shadow) return 'none';
  return `0 ${2 * scale}px ${shadow.blur * scale}px ${shadow.color}`;
};

export const getSlideBackgroundStyle = (background: Background): React.CSSProperties => {
  switch (background.type) {
    case 'image':
      return {
        backgroundImage: `url(${background.value})`,
        backgroundSize: background.size || 'cover',
        backgroundPosition: background.position || 'center',
        backgroundRepeat: 'no-repeat',
      };

    case 'color':
      return {
        backgroundColor: background.value,
      };

    case 'none':
    default:
      return {
        backgroundColor: '#fff',
      };
  }
};
