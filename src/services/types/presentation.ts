export interface SlideElement {
  id: string;
  type: 'text' | 'image' | 'shape' | 'line';
  x: number;
  y: number;
  width?: number;
  height?: number;
  text?: string;
  fontSize?: number;
  fontColor?: string;
  fontFamily?: string;
  url?: string;
  shapeType?: 'rectangle' | 'circle' | 'triangle';
  fillColor?: string;
  strokeColor?: string;
  strokeWidth?: number;
}

export interface Slide {
  id: string;
  background: {
    type: 'color' | 'image' | 'gradient';
    value: string;
  };
  elements: SlideElement[];
}

export interface Presentation {
  title: string;
  slides: Slide[];
  currentSlideId: string;
  selectedSlideIds: string[];
}
