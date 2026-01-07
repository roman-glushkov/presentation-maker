import React from 'react';
import { ImageElement as ImgEl } from '../../../../../store/types/presentation';
import { getShadowStyle } from './Helpers';

interface Props {
  element: ImgEl;
  scale: number;
}

export function ImageElement({ element, scale }: Props) {
  const s = scale;
  const shadowStyle = getShadowStyle(element.shadow, s);

  return (
    <div
      style={{
        position: 'absolute',
        left: element.position.x * s,
        top: element.position.y * s,
        width: element.size.width * s,
        height: element.size.height * s,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        filter: shadowStyle !== 'none' ? `drop-shadow(${shadowStyle})` : 'none',
        borderRadius: element.smoothing ? `${element.smoothing * s}px` : '0',
        overflow: 'hidden',
        userSelect: 'none',
      }}
    >
      <img
        src={element.src}
        alt="Изображение"
        draggable={false}
        style={{
          width: element.size.width === 0 ? 'auto' : '100%',
          height: element.size.height === 0 ? 'auto' : '100%',
          objectFit: 'fill',
          borderRadius: element.smoothing ? `${element.smoothing * s}px` : '0',
          userSelect: 'none',
        }}
      />
    </div>
  );
}
