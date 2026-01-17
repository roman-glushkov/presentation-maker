import React from 'react';
import { Slide } from '../../../../store/types/presentation';
import { SlideRenderer } from '../../../shared/SlideRenderer';

interface Props {
  slide: Slide;
}

export function PreviewWorkspace({ slide }: Props) {
  return (
    <div className="slide-preview-wrapper">
      <div className="slide-preview">
        <SlideRenderer slide={slide} scale={0.25} />
      </div>
    </div>
  );
}
