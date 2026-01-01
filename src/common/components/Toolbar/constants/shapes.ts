import { ShapeType } from '../../../../store/types/presentation';

export interface ShapeOption {
  label: string;
  type: ShapeType;
  icon: string;
}

export const SHAPE_OPTIONS: ShapeOption[] = [
  { label: 'Прямоугольник', type: 'rectangle', icon: '▭' },
  { label: 'Круг', type: 'circle', icon: '○' },
  { label: 'Треугольник', type: 'triangle', icon: '△' },
  { label: 'Линия', type: 'line', icon: '━' },
  { label: 'Стрелка', type: 'arrow', icon: '→' },
  { label: 'Звезда', type: 'star', icon: '★' },
  { label: 'Шестиугольник', type: 'hexagon', icon: '⬢' },
  { label: 'Сердце', type: 'heart', icon: '♥' },
  { label: 'Облако', type: 'cloud', icon: '☁' },
  { label: 'Выноска', type: 'callout', icon: '💬' },
];

export const DEFAULT_SHAPE_SIZE = {
  width: 150,
  height: 100,
};

export const DEFAULT_SHAPE_STYLES = {
  fill: '#ffffff',
  stroke: '#000000',
  strokeWidth: 2,
};
