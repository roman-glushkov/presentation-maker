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
      className="slide-element slide-image-element"
      style={{
        left: element.position.x * s,
        top: element.position.y * s,
        width: element.size.width * s,
        height: element.size.height * s,
        filter: shadowStyle !== 'none' ? `drop-shadow(${shadowStyle})` : 'none',
        borderRadius: element.smoothing ? `${element.smoothing * s}px` : '0',
      }}
    >
      <img
        src={element.src}
        alt=""
        draggable={false}
        style={{
          width: element.size.width === 0 ? 'auto' : '100%',
          height: element.size.height === 0 ? 'auto' : '100%',
          borderRadius: element.smoothing ? `${element.smoothing * s}px` : '0',
        }}
      />
    </div>
  );
}
