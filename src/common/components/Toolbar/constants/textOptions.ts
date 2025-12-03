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
