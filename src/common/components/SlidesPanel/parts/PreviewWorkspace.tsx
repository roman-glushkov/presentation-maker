import React from 'react';
import { Slide, SlideElement } from '../../../../store/types/presentation';
import { getSlideBackgroundStyle } from './renderer/Helpers';
import { TextElement } from './renderer/TextElement';
import { ImageElement } from './renderer/ImageElement';
import { ShapeElement } from './renderer/ShapeElement';

interface Props {
  slide: Slide;
  scale: number;
}

export function PreviewWorkspace({ slide, scale }: Props) {
  return (
    <div className="slide-preview-wrapper">
      <div
        className="slide-preview"
        style={{
          width: 960 * scale,
          height: 540 * scale,
          position: 'relative',
          overflow: 'hidden',
          ...getSlideBackgroundStyle(slide.background),
        }}
      >
        {slide.elements.map((el: SlideElement) => {
          switch (el.type) {
            case 'text':
              return <TextElement key={el.id} element={el} scale={scale} />;

            case 'image':
              return <ImageElement key={el.id} element={el} scale={scale} />;

            case 'shape':
              return <ShapeElement key={el.id} element={el} scale={scale} />;

            default:
              return null;
          }
        })}
      </div>
    </div>
  );
}
