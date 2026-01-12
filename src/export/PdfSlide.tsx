import React from 'react';
import { Slide } from '../store/types/presentation';
import { SlideRenderer } from '../store/utils/SlideRenderer';

export const PdfSlide = ({ slide }: { slide: Slide }) => {
  return <SlideRenderer slide={slide} scale={1} />;
};
