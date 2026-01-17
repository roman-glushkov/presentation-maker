import React from 'react';
import {
  ImageElement as ImageElementType,
  SlideElement,
} from '../../../../store/types/presentation';
import { createElementComponent } from './BaseElement';
import { getImageStyles } from '../../../shared/imageStyles';

interface ImageElementProps {
  elementId: string;
  preview: boolean;
  selectedElementIds: string[];
  onElementClick: (e: React.MouseEvent, elementId: string) => void;
  getAllElements: () => SlideElement[];
}

const ImageElementContent = ({ element }: { element: ImageElementType }) => {
  const { dynamicContainerStyle, imageStyle, containerClass } = getImageStyles(element);

  return (
    <div className={containerClass} style={dynamicContainerStyle}>
      <img
        src={element.src}
        alt="Изображение"
        draggable={false}
        className="image-content"
        style={imageStyle}
      />
    </div>
  );
};

const ImageElementBase = createElementComponent<ImageElementType>('image', (element) => (
  <ImageElementContent element={element} />
));

export default function ImageElementView(props: ImageElementProps) {
  return <ImageElementBase {...props} />;
}
