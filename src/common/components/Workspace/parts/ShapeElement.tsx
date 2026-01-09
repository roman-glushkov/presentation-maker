import React from 'react';
import {
  ShapeElement as ShapeElementType,
  SlideElement,
} from '../../../../store/types/presentation';
import { createElementComponent } from './BaseElement';
import { renderShape } from '../utils/shapeRenderer';

const getShadowStyle = (shadow: ShapeElementType['shadow'], scale: number = 1): string => {
  if (!shadow) return 'none';

  const offsetX = 0;
  const offsetY = 2;

  return `${offsetX * scale}px ${offsetY * scale}px ${shadow.blur * scale}px ${shadow.color}`;
};

interface ShapeElementProps {
  elementId: string;
  preview: boolean;
  selectedElementIds: string[];
  onElementClick: (e: React.MouseEvent, elementId: string) => void;
  getAllElements: () => SlideElement[];
}

const ShapeElementContent = ({ element }: { element: ShapeElementType }) => {
  const shadowStyle = getShadowStyle(element.shadow);

  return (
    <svg
      viewBox={`0 0 ${element.size.width} ${element.size.height}`}
      width="100%"
      height="100%"
      preserveAspectRatio="none"
      style={{
        filter: shadowStyle !== 'none' ? `drop-shadow(${shadowStyle})` : 'none',
      }}
    >
      {renderShape(element)}
    </svg>
  );
};

const ShapeElementBase = createElementComponent<ShapeElementType>('shape', (element) => (
  <ShapeElementContent element={element} />
));

export default function ShapeElementView(props: ShapeElementProps) {
  return <ShapeElementBase {...props} />;
}
