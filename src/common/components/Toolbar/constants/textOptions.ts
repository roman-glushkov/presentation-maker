export interface TextOption {
  label: string;
  key: string;
}

export const TEXT_SIZE_OPTIONS: TextOption[] = [
  { label: '8', key: '8px' },
  { label: '10', key: '10px' },
  { label: '12', key: '12px' },
  { label: '14', key: '14px' },
  { label: '16', key: '16px' },
  { label: '18', key: '18px' },
  { label: '20', key: '20px' },
  { label: '24', key: '24px' },
  { label: '28', key: '28px' },
  { label: '32', key: '32px' },
  { label: '36', key: '36px' },
  { label: '48', key: '48px' },
  { label: '54', key: '54px' },
  { label: '60', key: '60px' },
  { label: '66', key: '66px' },
  { label: '72', key: '72px' },
  { label: '80', key: '80px' },
  { label: '88', key: '88px' },
  { label: '96', key: '96px' },
];

export const TEXT_ALIGN_OPTIONS: TextOption[] = [
  { label: '⬅️ Влево', key: 'left' },
  { label: '➡️ Вправо', key: 'right' },
  { label: '↔️ По центру', key: 'center' },
  { label: '↔️ По ширине', key: 'justify' },
];

export const TEXT_VERTICAL_ALIGN_OPTIONS: TextOption[] = [
  { label: '⬆️ Вверх', key: 'top' },
  { label: '↕️ Центр', key: 'middle' },
  { label: '⬇️ Вниз', key: 'bottom' },
];

export const LINE_HEIGHT_OPTIONS: TextOption[] = [
  { label: '1', key: '1' },
  { label: '1.15', key: '1.15' },
  { label: '1.5', key: '1.5' },
  { label: '2', key: '2' },
  { label: '2.5', key: '2.5' },
  { label: '3', key: '3' },
];

export const FONT_FAMILY_OPTIONS: TextOption[] = [
  { label: 'Arial', key: 'Arial, sans-serif' },
  { label: 'Times New Roman', key: "'Times New Roman', serif" },
  { label: 'Georgia', key: 'Georgia, serif' },
  { label: 'Verdana', key: 'Verdana, sans-serif' },
  { label: 'Tahoma', key: 'Tahoma, sans-serif' },
  { label: 'Trebuchet MS', key: "'Trebuchet MS', sans-serif" },
  { label: 'Courier New', key: "'Courier New', monospace" },
  { label: 'Brush Script MT', key: "'Brush Script MT', cursive" },
  { label: 'Impact', key: 'Impact, sans-serif' },
  { label: 'Comic Sans MS', key: "'Comic Sans MS', sans-serif" },
  { label: 'Lucida Console', key: "'Lucida Console', monospace" },
];

export interface ShadowOption {
  label: string;
  key: string;
  color: string;
  blur: number;
}

export const TEXT_SHADOW_OPTIONS: ShadowOption[] = [
  { label: 'Без тени', key: 'none', color: '#000000', blur: 0 },
  { label: 'Лёгкая', key: 'light', color: 'rgba(0, 0, 0, 0.15)', blur: 3 },
  { label: 'Средняя', key: 'medium', color: 'rgba(0, 0, 0, 0.3)', blur: 5 },
  { label: 'Сильная', key: 'heavy', color: 'rgba(0, 0, 0, 0.5)', blur: 8 },
  { label: 'Красная', key: 'red', color: 'rgba(255, 0, 0, 0.5)', blur: 6 },
  { label: 'Синяя', key: 'blue', color: 'rgba(0, 123, 255, 0.5)', blur: 6 },
  { label: 'Зелёная', key: 'green', color: 'rgba(0, 128, 0, 0.5)', blur: 6 },
  { label: 'Жёлтая', key: 'yellow-glow', color: 'rgba(255, 215, 0, 0.7)', blur: 10 },
  { label: 'Фиолетовая', key: 'purple-glow', color: 'rgba(128, 0, 128, 0.6)', blur: 8 },
  { label: 'Розовая', key: 'pink', color: 'rgba(255, 105, 180, 0.5)', blur: 6 },
  { label: 'Оранжевая', key: 'orange', color: 'rgba(255, 165, 0, 0.5)', blur: 6 },
  { label: 'Белая', key: 'white-glow', color: 'rgba(255, 255, 255, 0.8)', blur: 12 },
];

export interface SmoothingOption {
  label: string;
  key: string;
  value: number;
}

export const SHAPE_SMOOTHING_OPTIONS: SmoothingOption[] = [
  { label: '0 px', key: 'none', value: 0 },
  { label: '10 px', key: 'light', value: 10 },
  { label: '20 px', key: 'medium', value: 20 },
  { label: '50 px', key: 'strong', value: 50 },
  { label: '100 px', key: 'very-strong', value: 100 },
];

export interface ListOption {
  label: string;
  key: string;
  prefix?: string;
}

export const LIST_OPTIONS: ListOption[] = [
  { label: 'Без маркера', key: 'bullet_none', prefix: '' },
  { label: 'Точка', key: 'bullet_disc', prefix: '• ' },
  { label: 'Круг', key: 'bullet_circle', prefix: '○ ' },
  { label: 'Квадрат', key: 'bullet_square', prefix: '▪ ' },
  { label: 'Стрелка', key: 'bullet_arrow', prefix: '→ ' },
  { label: 'Галочка', key: 'bullet_check', prefix: '✓ ' },
  { label: 'Звезда', key: 'bullet_star', prefix: '⭐ ' },
];
