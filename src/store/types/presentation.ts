// Основной тип, представляющий всю презентацию
export type Presentation = {
  title: string; // Название презентации
  slides: Slide[]; // Массив слайдов
  currentSlideId: string; // ID текущего активного слайда
  selectedSlideIds: string[]; // ID выбранных слайдов (для групповых операций)
};

// Тип, представляющий отдельный слайд
export type Slide = {
  id: string; // Уникальный идентификатор слайда
  background: Background; // Фон слайда
  elements: SlideElement[]; // Элементы на слайде (текст, изображения, фигуры)
};

// Тип для представления выбора (селекции) элементов
export type Selection = {
  slideId: string; // ID слайда, на котором происходит выбор
  elementIds: string[]; // ID выбранных элементов на этом слайде
};

// Тип для определения фона слайда
export type Background =
  | { type: 'color'; value: string; isLocked?: boolean } // Цветной фон
  | { type: 'image'; value: string; size?: string; position?: string; isLocked?: boolean } // Изображение в качестве фона
  | { type: 'none' }; // Прозрачный фон

// Объединенный тип для всех возможных элементов слайда
export type SlideElement = TextElement | ImageElement | ShapeElement;

// Тип для позиционирования элемента на слайде (координаты)
export type Position = {
  x: number; // Координата X (по горизонтали)
  y: number; // Координата Y (по вертикали)
};

// Тип для размеров элемента
export type Size = {
  width: number; // Ширина элемента
  height: number; // Высота элемента
};

// Базовый тип, содержащий общие свойства для всех элементов
type BaseElement = {
  id: string; // Уникальный идентификатор элемента
  position: Position; // Позиция элемента на слайде
  size: Size; // Размеры элемента
  shadow?: {
    // Тень элемента (опционально)
    color: string; // Цвет тени
    blur: number; // Размытие тени
  };
};

// Тип для текстовых элементов
export type TextElement = BaseElement & {
  type: 'text'; // Тип элемента - текст
  content: string; // Текстовое содержимое
  font: string; // Название шрифта
  fontSize: number; // Размер шрифта
  color: string; // Цвет текста
  backgroundColor?: string; // Фоновый цвет текстового блока
  align?: 'left' | 'center' | 'right' | 'justify'; // Горизонтальное выравнивание
  verticalAlign?: 'top' | 'middle' | 'bottom'; // Вертикальное выравнивание
  lineHeight?: number; // Межстрочный интервал
  bold?: boolean; // Жирное начертание
  italic?: boolean; // Курсивное начертание
  placeholder?: string; // Текст-заполнитель (placeholder)
  underline?: boolean; // Подчеркивание текста
  smoothing?: number; // Сглаживание текста (антиалиасинг)
};

// Тип для элементов изображения
export type ImageElement = BaseElement & {
  type: 'image'; // Тип элемента - изображение
  src: string; // Путь к файлу изображения (URL или base64)
  smoothing?: number; // Сглаживание изображения
};

// Тип для определения всех возможных фигур
export type ShapeType =
  | 'rectangle' // Прямоугольник
  | 'circle' // Круг
  | 'triangle' // Треугольник
  | 'line' // Линия
  | 'arrow' // Стрелка
  | 'star' // Звезда
  | 'hexagon' // Шестиугольник
  | 'heart' // Сердце
  | 'cloud' // Облако
  | 'callout'; // Выноска (для комиксов, аннотаций)

// Тип для графических элементов (фигур)
export type ShapeElement = BaseElement & {
  type: 'shape'; // Тип элемента - фигура
  shapeType: ShapeType; // Конкретный тип фигуры
  fill: string; // Цвет заливки фигуры
  stroke: string; // Цвет обводки (контура)
  strokeWidth: number; // Толщина обводки
};
