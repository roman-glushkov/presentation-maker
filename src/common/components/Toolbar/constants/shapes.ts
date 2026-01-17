import { ShapeType } from '../../../../store/types/presentation';

export interface ShapeOption {
  label: string;
  key: ShapeType;
  prefix: string;
}

export const SHAPE_OPTIONS: ShapeOption[] = [
  { label: 'Прямоугольник', key: 'rectangle', prefix: '▭' },
  { label: 'Круг', key: 'circle', prefix: '○' },
  { label: 'Треугольник', key: 'triangle', prefix: '△' },
  { label: 'Звезда', key: 'star', prefix: '★' },
  { label: 'Шестиугольник', key: 'hexagon', prefix: '⬢' },
  { label: 'Сердце', key: 'heart', prefix: '♥' },
  { label: 'Облако', key: 'cloud', prefix: '☁' },
  { label: 'Выноска', key: 'callout', prefix: '💬' },
];

export const DEFAULT_SHAPE_SIZE = {
  width: 150,
  height: 100,
};

export const DEFAULT_SHAPE_STYLES = {
  fill: 'transparent',
  stroke: '#000000',
};
