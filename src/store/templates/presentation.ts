import { TextElement, ImageElement } from '../types/presentation';

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
