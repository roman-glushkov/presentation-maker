import { TextElement, ImageElement, ShapeElement, ShapeType } from '../types/presentation';

export const textElementTemplate: TextElement = {
  type: 'text',
  id: '',
  content: '',
  placeholder: 'Новый текст',
  position: { x: 50, y: 50 },
  size: { width: 200, height: 30 },
  font: 'Arial',
  fontSize: 16,
  color: '#000000ff',
  align: 'center',
  verticalAlign: 'middle',
};

export const imageElementTemplate: ImageElement = {
  type: 'image',
  id: '',
  src: '',
  position: { x: 400, y: 300 },
  size: { width: 400, height: 300 },
};

// ШАБЛОН ДЛЯ ФИГУР
export const shapeElementTemplate: ShapeElement = {
  type: 'shape',
  id: '',
  shapeType: 'rectangle',
  position: { x: 100, y: 100 },
  size: { width: 150, height: 100 },
  fill: '#ffffff',
  stroke: '#000000',
  strokeWidth: 2,
};

export const newFontSize = 20;
export const newFont = 'Verdana';

export const createTextElement = (): TextElement => ({
  ...textElementTemplate,
  id: `text${Date.now()}`,
});

export const createImageElement = (): ImageElement => ({
  ...imageElementTemplate,
  id: `img${Date.now()}`,
});

// ФУНКЦИЯ ДЛЯ СОЗДАНИЯ ФИГУРЫ
export const createShapeElement = (shapeType: ShapeType): ShapeElement => ({
  ...shapeElementTemplate,
  id: `shape-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
  shapeType,
});
