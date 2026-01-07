import React from 'react';
import { Slide } from '../../../../store/types/presentation';
import { PreviewWorkspace } from './PreviewWorkspace';

interface Props {
  slide: Slide;
  scale: number;
}

export function Preview({ slide, scale }: Props) {
  return <PreviewWorkspace slide={slide} scale={scale} />;
}
