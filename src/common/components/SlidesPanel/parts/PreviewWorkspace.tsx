import React from 'react';
import { Slide } from '../../../../store/types/presentation';
import { SlideRenderer } from '../../../../store/utils/SlideRenderer';

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
        }}
      >
        <SlideRenderer slide={slide} scale={scale} />
      </div>
    </div>
  );
}
