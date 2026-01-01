import {
  Presentation,
  Slide,
  TextElement,
  ImageElement,
  Background,
  ShapeElement,
  ShapeType,
  Size,
} from '../types/presentation';
import { createShapeElement } from '../templates/presentation';

export function changeTitle(presentation: Presentation, newTitle: string): Presentation {
  return { ...presentation, title: newTitle };
}

export function addSlide(presentation: Presentation, newSlide: Slide): Presentation {
  return { ...presentation, slides: [...presentation.slides, { ...newSlide }] };
}

export function removeSlide(presentation: Presentation, slideId: string): Presentation {
  return {
    ...presentation,
    slides: presentation.slides.filter((slide) => slide.id !== slideId),
  };
}

export function addText(slide: Slide, textElement: TextElement): Slide {
  return { ...slide, elements: [...slide.elements, { ...textElement }] };
}

export function addImage(slide: Slide, imageElement: ImageElement): Slide {
  return { ...slide, elements: [...slide.elements, { ...imageElement }] };
}

export function removeElement(slide: Slide, elementId: string): Slide {
  return {
    ...slide,
    elements: slide.elements.filter((element) => element.id !== elementId),
  };
}

export function changeElementSize(slide: Slide, elementId: string, newSize: Size): Slide {
  const newElements = slide.elements.map((element) => {
    if (element.id === elementId) {
      return { ...element, size: { ...newSize } };
    }
    return element;
  });
  return { ...slide, elements: newElements };
}

export function changeText(slide: Slide, elementId: string, newContent: string): Slide {
  const newElements = slide.elements.map((element) => {
    if (element.type === 'text' && element.id === elementId) {
      return { ...element, content: newContent };
    }
    return element;
  });
  return { ...slide, elements: newElements };
}

export function changeTextSize(slide: Slide, elementId: string, newSize: number): Slide {
  const newElements = slide.elements.map((element) => {
    if (element.type === 'text' && element.id === elementId) {
      return { ...element, fontSize: newSize };
    }
    return element;
  });
  return { ...slide, elements: newElements };
}

export function changeTextAlignment(
  slide: Slide,
  elementId: string,
  alignment: 'left' | 'center' | 'right' | 'justify'
): Slide {
  return {
    ...slide,
    elements: slide.elements.map((el) =>
      el.type === 'text' && el.id === elementId ? { ...el, align: alignment } : el
    ),
  };
}

export function changeTextVerticalAlignment(
  slide: Slide,
  elementId: string,
  verticalAlign: 'top' | 'middle' | 'bottom'
): Slide {
  return {
    ...slide,
    elements: slide.elements.map((el) =>
      el.type === 'text' && el.id === elementId ? { ...el, verticalAlign } : el
    ),
  };
}

export function changeTextLineHeight(slide: Slide, elementId: string, lineHeight: number): Slide {
  return {
    ...slide,
    elements: slide.elements.map((el) =>
      el.type === 'text' && el.id === elementId ? { ...el, lineHeight } : el
    ),
  };
}

export function changeTextFont(slide: Slide, elementId: string, newFont: string): Slide {
  const newElements = slide.elements.map((element) => {
    if (element.type === 'text' && element.id === elementId) {
      return { ...element, font: newFont };
    }
    return element;
  });
  return { ...slide, elements: newElements };
}

export function changeBackground(slide: Slide, newBackground: Background): Slide {
  return { ...slide, background: { ...newBackground } };
}

export function changeTextColor(slide: Slide, elementId: string, color: string): Slide {
  return {
    ...slide,
    elements: slide.elements.map((el) =>
      el.type === 'text' && el.id === elementId ? { ...el, color } : el
    ),
  };
}

export function changeTextBackgroundColor(
  slide: Slide,
  elementId: string,
  backgroundColor: string
): Slide {
  return {
    ...slide,
    elements: slide.elements.map((el) =>
      el.type === 'text' && el.id === elementId ? { ...el, backgroundColor } : el
    ),
  };
}

export function toggleTextBold(slide: Slide, elementId: string): Slide {
  return {
    ...slide,
    elements: slide.elements.map((el) =>
      el.type === 'text' && el.id === elementId ? { ...el, bold: !el.bold } : el
    ),
  };
}

export function toggleTextItalic(slide: Slide, elementId: string): Slide {
  return {
    ...slide,
    elements: slide.elements.map((el) =>
      el.type === 'text' && el.id === elementId ? { ...el, italic: !el.italic } : el
    ),
  };
}

export function toggleTextUnderline(slide: Slide, elementId: string): Slide {
  return {
    ...slide,
    elements: slide.elements.map((el) =>
      el.type === 'text' && el.id === elementId ? { ...el, underline: !el.underline } : el
    ),
  };
}

// Функция для добавления фигуры
export function addShape(slide: Slide, shapeElement: ShapeElement): Slide {
  return { ...slide, elements: [...slide.elements, { ...shapeElement }] };
}

// Функция для создания базовой фигуры (теперь используем шаблон)
export function createBasicShape(shapeType: ShapeType): ShapeElement {
  return createShapeElement(shapeType);
}

// Функция для изменения заливки фигуры
export function changeShapeFill(slide: Slide, elementId: string, fill: string): Slide {
  return {
    ...slide,
    elements: slide.elements.map((el) =>
      el.type === 'shape' && el.id === elementId ? { ...el, fill } : el
    ),
  };
}

// Функция для изменения цвета границы фигуры
export function changeShapeStroke(slide: Slide, elementId: string, stroke: string): Slide {
  return {
    ...slide,
    elements: slide.elements.map((el) =>
      el.type === 'shape' && el.id === elementId ? { ...el, stroke } : el
    ),
  };
}

// Функция для изменения толщины границы фигуры
export function changeShapeStrokeWidth(
  slide: Slide,
  elementId: string,
  strokeWidth: number
): Slide {
  return {
    ...slide,
    elements: slide.elements.map((el) =>
      el.type === 'shape' && el.id === elementId ? { ...el, strokeWidth } : el
    ),
  };
}
