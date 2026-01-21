import React from 'react';
import { ImageElement as ImageElementType } from '../../store/types/presentation';

export const getImageStyles = (element: ImageElementType) => {
  const dynamicContainerStyle: React.CSSProperties = {
    overflow: 'visible',
  };

  const imageStyle: React.CSSProperties = {
    position: 'absolute',
    width: '100%',
    height: '100%',
    objectFit: 'fill',
    borderRadius: element.smoothing ? `${element.smoothing}px` : '0',
    boxShadow: element.shadow ? `0 2px ${element.shadow.blur}px 0 ${element.shadow.color}` : 'none',
  };

  const containerClass = 'image-container';

  return {
    dynamicContainerStyle,
    imageStyle,
    containerClass,
  };
};
