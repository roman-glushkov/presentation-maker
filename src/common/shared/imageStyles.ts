import React from 'react';
import { ImageElement as ImageElementType } from '../../store/types/presentation';

export const getImageStyles = (element: ImageElementType) => {
  const dynamicContainerStyle: React.CSSProperties = {
    boxShadow: element.shadow ? `0 4px ${element.shadow.blur}px ${element.shadow.color}` : 'none',
    borderRadius: element.smoothing ? `${element.smoothing}px` : '0',
  };

  const imageStyle: React.CSSProperties = {
    position: 'absolute',
    width: '100%',
    height: '100%',
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
