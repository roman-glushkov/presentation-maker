export type GroupKey = 'slides' | 'text' | 'elements' | 'design';

export interface GroupButton {
  label: string;
  action: string;
}

export const GROUPS: Record<GroupKey, GroupButton[]> = {
  slides: [
    { label: '➕ Слайд', action: 'ADD_SLIDE' },
    { label: '🗑️ Удалить', action: 'REMOVE_SLIDE' },
    { label: '📄 Дублировать ❌', action: 'DUPLICATE_SLIDE' },
    { label: '✨ Переходы ❌', action: 'SLIDE_TRANSITIONS' },
  ],
  text: [
    { label: '📝 Текст', action: 'ADD_TEXT' },
    { label: '🔠 Размер', action: 'TEXT_SIZE' },
    { label: '🎨 Шрифт ❌', action: 'TEXT_FONT' },
    { label: '↔️ Выравнивание', action: 'TEXT_ALIGN' },
    { label: '↕️ Интервал', action: 'TEXT_LINE_HEIGHT' },
    { label: '𝐁 Жирный', action: 'TEXT_BOLD' },
    { label: '𝑰 Курсив', action: 'TEXT_ITALIC' },
    { label: 'U Подчеркнутый', action: 'TEXT_UNDERLINE' },
  ],
  elements: [
    { label: '🖼️ Картинка', action: 'ADD_IMAGE' },
    { label: '❌ Удалить', action: 'REMOVE_ELEMENT' },
    { label: '🔄 Поворот ❌', action: 'ROTATE_ELEMENT' },
    { label: '📑 Дублировать ❌', action: 'DUPLICATE_ELEMENT' },
    { label: '🌫️ Прозрачность ❌', action: 'ELEMENT_OPACITY' },
    { label: '📌 Группировка ❌', action: 'GROUP_ELEMENTS' },
    { label: '🖼️ Передний план ❌', action: 'BRING_TO_FRONT' },
    { label: '🖼️ Задний план ❌', action: 'SEND_TO_BACK' },
  ],
  design: [
    { label: '🎨 Фон', action: 'SLIDE_BACKGROUND' },
    { label: '🖍️ Цвет текста', action: 'TEXT_COLOR' },
    { label: '🧱 Заливка фигуры', action: 'SHAPE_FILL' },
    { label: '📐 Сетка ❌', action: 'SHOW_GRID' },
    { label: '✨ Анимации ❌', action: 'ADD_ANIMATION' },
    { label: '🎭 Тема ❌', action: 'CHANGE_THEME' },
    { label: '🔲 Тень/границы ❌', action: 'ELEMENT_STYLE' },
    { label: '🌈 Градиенты ❌', action: 'APPLY_GRADIENT' },
    { label: '🖼️ Фильтры ❌', action: 'IMAGE_FILTERS' },
  ],
};

export const TAB_TITLES: { key: GroupKey; name: string }[] = [
  { key: 'slides', name: 'Слайды' },
  { key: 'text', name: 'Текст' },
  { key: 'elements', name: 'Элементы' },
  { key: 'design', name: 'Дизайн' },
];
