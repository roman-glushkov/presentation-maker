import React from 'react';
import { ShapeElement as ShapeEl } from '../../../../../store/types/presentation';
import { renderShape } from '../../../Workspace/utils/shapeRenderer';
import { getShadowStyle } from './Helpers';

interface Props {
  element: ShapeEl;
  scale: number;
}

export function ShapeElement({ element, scale }: Props) {
  const s = scale;
  const w = element.size.width * s;
  const h = element.size.height * s;
  const shadowStyle = getShadowStyle(element.shadow, s);

  const commonStyle = {
    filter: shadowStyle !== 'none' ? `drop-shadow(${shadowStyle})` : 'none',
  };

  const scaledElement = {
    ...element,
    size: {
      width: w,
      height: h,
    },
    strokeWidth: element.strokeWidth * s,
  };

  return (
    <svg
      className="slide-svg-element"
      width={w}
      height={h}
      style={{
        left: element.position.x * s,
        top: element.position.y * s,
        ...commonStyle,
      }}
    >
      {renderShape(scaledElement)}
    </svg>
  );
}
