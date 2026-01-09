import React from 'react';
import { ImageElement as ImageElementType } from '../../../../../store/types/presentation';

export const getImageStyles = (element: ImageElementType) => {
  const dynamicContainerStyle: React.CSSProperties = {
    boxShadow: element.shadow ? `0 4px ${element.shadow.blur}px ${element.shadow.color}` : 'none',
    borderRadius: element.smoothing ? `${element.smoothing}px` : '0',
  };

  const imageStyle: React.CSSProperties = {
    width: element.size.width === 0 ? 'auto' : '100%',
    height: element.size.height === 0 ? 'auto' : '100%',
    objectFit: 'fill',
    borderRadius: element.smoothing ? `${element.smoothing}px` : '0',
  };

  const containerClass = 'image-container';

  return {
    dynamicContainerStyle,
    imageStyle,
    containerClass,
  };
};
