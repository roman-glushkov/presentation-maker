// constants/config.ts
export type GroupKey = 'main' | 'insert' | 'colors' | 'effects' | 'transitions' | 'view';

export interface GroupButton {
  label: string;
  action: string;
}

export const GROUPS: Record<GroupKey, GroupButton[]> = {
  main: [
    { label: '➕ Слайд', action: 'ADD_SLIDE' },
    { label: '⎘ Дублировать', action: 'DUPLICATE_SLIDE' },
    { label: '|', action: 'SEPARATOR' },
    { label: '🔠 Размер', action: 'TEXT_SIZE' },
    { label: '🎨 Шрифт', action: 'TEXT_FONT' },
    { label: '↔️ Выравнивание', action: 'TEXT_ALIGN' },
    { label: '↕️ Интервал', action: 'TEXT_LINE_HEIGHT' },
    { label: '𝐁 Жирный', action: 'TEXT_BOLD' },
    { label: '𝑰 Курсив', action: 'TEXT_ITALIC' },
    { label: 'U Подчеркнутый', action: 'TEXT_UNDERLINE' },
  ],
  insert: [
    { label: '📝 Текст', action: 'ADD_TEXT' },
    { label: '🖼️ Картинка', action: 'ADD_IMAGE' },
    { label: '🔗 По ссылке', action: 'ADD_IMAGE_FROM_URL' },
    { label: '🔷 Фигуры', action: 'ADD_SHAPE' },
    //{ label: '📊 Диаграмма ❌', action: 'ADD_CHART' },
    //{ label: '🔗 Ссылка ❌', action: 'ADD_LINK' },
  ],
  colors: [
    { label: '🎨 Фон слайда', action: 'SLIDE_BACKGROUND' },
    { label: '🖍️ Цвет текста', action: 'TEXT_COLOR' },
    { label: '🧱 Заливка фигуры', action: 'SHAPE_FILL' },
    { label: '🖌️ Цвет границы', action: 'SHAPE_STROKE' },
  ],
  effects: [
    { label: '📏 Толщина', action: 'SHAPE_STROKE_WIDTH' },
    { label: '✨ Тень', action: 'TEXT_SHADOW' },
    { label: '💎 Отражение', action: 'TEXT_REFLECTION' },
    { label: '🎯 Сглаживание', action: 'SHAPE_SMOOTHING' },
  ],
  transitions: [
    /*
    { label: '✨ Переходы ❌', action: 'SLIDE_TRANSITIONS' },
    { label: '✨ Анимации ❌', action: 'ADD_ANIMATION' },
    { label: '⏱️ Тайминг ❌', action: 'ANIMATION_TIMING' },
    { label: '🎬 Предпросмотр ❌', action: 'PREVIEW_ANIMATIONS' },
    */
  ],
  view: [
    /*
    { label: '🔲 Разметка ❌', action: 'SHOW_LAYOUT' },
    { label: '📐 Направляющие ❌', action: 'SHOW_GUIDES' },
    { label: '🎯 Привязка ❌', action: 'ENABLE_SNAP' },
    { label: '📏 Линейки ❌', action: 'SHOW_RULERS' },
    { label: '👁️ Скрытые ❌', action: 'SHOW_HIDDEN' },
    { label: '🔍 Масштаб ❌', action: 'ZOOM' },
     */
  ],
};

export const TAB_TITLES: { key: GroupKey; name: string }[] = [
  { key: 'main', name: 'Главная' },
  { key: 'insert', name: 'Вставка' },
  { key: 'colors', name: 'Цвета' },
  { key: 'effects', name: 'Эффекты' },
  //{ key: 'transitions', name: 'Переходы' },
  //{ key: 'view', name: 'Вид' },
];
