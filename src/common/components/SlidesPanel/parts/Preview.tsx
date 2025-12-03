import React from 'react';
import { Slide } from '../../../../store/types/presentation';
import { SlidePreview } from './PreviewWorkspace';

interface Props {
  slide: Slide;
  scale: number;
}

export function Preview({ slide, scale }: Props) {
  return <SlidePreview slide={slide} scale={scale} />;
}
