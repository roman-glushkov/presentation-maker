import { SlideElement } from '../../../../store/types/presentation';

// Типы выбранных элементов
export type SelectionType =
  | 'shape' // Фигура
  | 'text' // Текст
  | 'image' // Фотография
  | 'slide' // Слайд (фон слайда)
  | 'multiple' // Несколько элементов разных типов
  | 'other' // Другие элементы (кнопки и т.д.)
  | 'none'; // Ничего не выбрано

// Тип для конфигурации доступности
export interface ButtonAvailability {
  action: string; // Действие из config.ts
  available: boolean; // Доступна ли кнопка
  reason?: string; // Причина блокировки (для тултипа)
}

// Конфигурация доступности для каждого типа выбора
export const availabilityConfig: Record<SelectionType, ButtonAvailability[]> = {
  // 1. ФИГУРА
  shape: [
    // Главная панель
    { action: 'ADD_SLIDE', available: true },
    { action: 'DUPLICATE_SLIDE', available: true },
    { action: 'TEXT_SIZE', available: false, reason: 'Выберите текстовый элемент' },
    { action: 'TEXT_FONT', available: false, reason: 'Выберите текстовый элемент' },
    { action: 'TEXT_ALIGN', available: false, reason: 'Выберите текстовый элемент' },
    { action: 'TEXT_LINE_HEIGHT', available: false, reason: 'Выберите текстовый элемент' },
    { action: 'TEXT_BOLD', available: false, reason: 'Выберите текстовый элемент' },
    { action: 'TEXT_ITALIC', available: false, reason: 'Выберите текстовый элемент' },
    { action: 'TEXT_UNDERLINE', available: false, reason: 'Выберите текстовый элемент' },
    { action: 'LIST_OPTIONS', available: false, reason: 'Выберите текстовый элемент' },

    // Вставка
    { action: 'ADD_TEXT', available: true },
    { action: 'ADD_IMAGE', available: true },
    { action: 'ADD_IMAGE_FROM_URL', available: true },
    { action: 'ADD_SHAPE', available: true },

    // Цвета
    { action: 'SLIDE_BACKGROUND', available: true },
    { action: 'TEXT_COLOR', available: false, reason: 'Выберите текстовый элемент' },
    { action: 'SHAPE_FILL', available: true },
    { action: 'SHAPE_STROKE', available: true },

    // Эффекты
    { action: 'SHAPE_STROKE_WIDTH', available: true },
    { action: 'TEXT_SHADOW', available: false, reason: 'Выберите текстовый элемент' },
    { action: 'SHAPE_SMOOTHING', available: false, reason: 'Выберите другой элемент' },

    // Вид
    { action: 'TOGGLE_GRID', available: true },
  ],

  // 2. ТЕКСТ
  text: [
    // Главная панель
    { action: 'ADD_SLIDE', available: true },
    { action: 'DUPLICATE_SLIDE', available: true },
    { action: 'TEXT_SIZE', available: true },
    { action: 'TEXT_FONT', available: true },
    { action: 'TEXT_ALIGN', available: true },
    { action: 'TEXT_LINE_HEIGHT', available: true },
    { action: 'TEXT_BOLD', available: true },
    { action: 'TEXT_ITALIC', available: true },
    { action: 'TEXT_UNDERLINE', available: true },
    { action: 'LIST_OPTIONS', available: true },

    // Вставка
    { action: 'ADD_TEXT', available: true },
    { action: 'ADD_IMAGE', available: true },
    { action: 'ADD_IMAGE_FROM_URL', available: true },
    { action: 'ADD_SHAPE', available: true },

    // Цвета
    { action: 'SLIDE_BACKGROUND', available: true },
    { action: 'TEXT_COLOR', available: true },
    { action: 'SHAPE_FILL', available: true },
    { action: 'SHAPE_STROKE', available: false, reason: 'Выберите фигуру' },

    // Эффекты
    { action: 'SHAPE_STROKE_WIDTH', available: false, reason: 'Выберите фигуру' },
    { action: 'TEXT_SHADOW', available: true },
    { action: 'SHAPE_SMOOTHING', available: true },

    // Вид
    { action: 'TOGGLE_GRID', available: true },
  ],

  // 3. ФОТОГРАФИЯ (изображение)
  image: [
    // Главная панель
    { action: 'ADD_SLIDE', available: true },
    { action: 'DUPLICATE_SLIDE', available: true },
    { action: 'TEXT_SIZE', available: false, reason: 'Выберите текстовый элемент' },
    { action: 'TEXT_FONT', available: false, reason: 'Выберите текстовый элемент' },
    { action: 'TEXT_ALIGN', available: false, reason: 'Выберите текстовый элемент' },
    { action: 'TEXT_LINE_HEIGHT', available: false, reason: 'Выберите текстовый элемент' },
    { action: 'TEXT_BOLD', available: false, reason: 'Выберите текстовый элемент' },
    { action: 'TEXT_ITALIC', available: false, reason: 'Выберите текстовый элемент' },
    { action: 'TEXT_UNDERLINE', available: false, reason: 'Выберите текстовый элемент' },
    { action: 'LIST_OPTIONS', available: false, reason: 'Выберите текстовый элемент' },

    // Вставка
    { action: 'ADD_TEXT', available: true },
    { action: 'ADD_IMAGE', available: true },
    { action: 'ADD_IMAGE_FROM_URL', available: true },
    { action: 'ADD_SHAPE', available: true },

    // Цвета
    { action: 'SLIDE_BACKGROUND', available: true },
    { action: 'TEXT_COLOR', available: false, reason: 'Выберите текстовый элемент' },
    { action: 'SHAPE_FILL', available: false, reason: 'Выберите фигуру' },
    { action: 'SHAPE_STROKE', available: false, reason: 'Выберите фигуру' },

    // Эффекты
    { action: 'SHAPE_STROKE_WIDTH', available: false, reason: 'Выберите фигуру' },
    { action: 'TEXT_SHADOW', available: false, reason: 'Выберите текстовый элемент' },
    { action: 'SHAPE_SMOOTHING', available: true },

    // Вид
    { action: 'TOGGLE_GRID', available: true },
  ],

  // 4. СЛАЙД (фон слайда)
  slide: [
    // Главная панель
    { action: 'ADD_SLIDE', available: true },
    { action: 'DUPLICATE_SLIDE', available: true },
    { action: 'TEXT_SIZE', available: false, reason: 'Выберите текстовый элемент' },
    { action: 'TEXT_FONT', available: false, reason: 'Выберите текстовый элемент' },
    { action: 'TEXT_ALIGN', available: false, reason: 'Выберите текстовый элемент' },
    { action: 'TEXT_LINE_HEIGHT', available: false, reason: 'Выберите текстовый элемент' },
    { action: 'TEXT_BOLD', available: false, reason: 'Выберите текстовый элемент' },
    { action: 'TEXT_ITALIC', available: false, reason: 'Выберите текстовый элемент' },
    { action: 'TEXT_UNDERLINE', available: false, reason: 'Выберите текстовый элемент' },
    { action: 'LIST_OPTIONS', available: false, reason: 'Выберите текстовый элемент' },

    // Вставка
    { action: 'ADD_TEXT', available: true },
    { action: 'ADD_IMAGE', available: true },
    { action: 'ADD_IMAGE_FROM_URL', available: true },
    { action: 'ADD_SHAPE', available: true },

    // Цвета
    { action: 'SLIDE_BACKGROUND', available: true },
    { action: 'TEXT_COLOR', available: false, reason: 'Выберите текстовый элемент' },
    { action: 'SHAPE_FILL', available: false, reason: 'Выберите фигуру' },
    { action: 'SHAPE_STROKE', available: false, reason: 'Выберите фигуру' },

    // Эффекты
    { action: 'SHAPE_STROKE_WIDTH', available: false, reason: 'Выберите фигуру' },
    { action: 'TEXT_SHADOW', available: false, reason: 'Выберите текстовый элемент' },
    { action: 'SHAPE_SMOOTHING', available: false, reason: 'Выберите фигуру' },

    // Дизайн (все доступно)

    // Вид
    { action: 'TOGGLE_GRID', available: true },
  ],

  // 5. ДРУГОЕ (кнопки и т.д.) или ничего не выбрано
  other: [
    // Главная панель
    { action: 'ADD_SLIDE', available: true },
    { action: 'DUPLICATE_SLIDE', available: true },
    { action: 'TEXT_SIZE', available: false, reason: 'Выберите текстовый элемент' },
    { action: 'TEXT_FONT', available: false, reason: 'Выберите текстовый элемент' },
    { action: 'TEXT_ALIGN', available: false, reason: 'Выберите текстовый элемент' },
    { action: 'TEXT_LINE_HEIGHT', available: false, reason: 'Выберите текстовый элемент' },
    { action: 'TEXT_BOLD', available: false, reason: 'Выберите текстовый элемент' },
    { action: 'TEXT_ITALIC', available: false, reason: 'Выберите текстовый элемент' },
    { action: 'TEXT_UNDERLINE', available: false, reason: 'Выберите текстовый элемент' },
    { action: 'LIST_OPTIONS', available: false, reason: 'Выберите текстовый элемент' },

    // Вставка
    { action: 'ADD_TEXT', available: true },
    { action: 'ADD_IMAGE', available: true },
    { action: 'ADD_IMAGE_FROM_URL', available: true },
    { action: 'ADD_SHAPE', available: true },

    // Цвета
    { action: 'SLIDE_BACKGROUND', available: true },
    { action: 'TEXT_COLOR', available: false, reason: 'Выберите текстовый элемент' },
    { action: 'SHAPE_FILL', available: false, reason: 'Выберите фигуру' },
    { action: 'SHAPE_STROKE', available: false, reason: 'Выберите фигуру' },

    // Эффекты
    { action: 'SHAPE_STROKE_WIDTH', available: false, reason: 'Выберите фигуру' },
    { action: 'TEXT_SHADOW', available: false, reason: 'Выберите текстовый элемент' },
    { action: 'SHAPE_SMOOTHING', available: false, reason: 'Выберите фигуру' },

    // Вид
    { action: 'TOGGLE_GRID', available: true },
  ],

  // МНОЖЕСТВЕННЫЙ ВЫБОР разных типов
  multiple: [
    // Главная панель - ЗАБЛОКИРОВАНО почти все
    { action: 'ADD_SLIDE', available: true },
    { action: 'DUPLICATE_SLIDE', available: true },
    { action: 'TEXT_SIZE', available: false, reason: 'Недоступно для группы элементов' },
    { action: 'TEXT_FONT', available: false, reason: 'Недоступно для группы элементов' },
    { action: 'TEXT_ALIGN', available: false, reason: 'Недоступно для группы элементов' },
    { action: 'TEXT_LINE_HEIGHT', available: false, reason: 'Недоступно для группы элементов' },
    { action: 'TEXT_BOLD', available: false, reason: 'Недоступно для группы элементов' },
    { action: 'TEXT_ITALIC', available: false, reason: 'Недоступно для группы элементов' },
    { action: 'TEXT_UNDERLINE', available: false, reason: 'Недоступно для группы элементов' },
    { action: 'LIST_OPTIONS', available: false, reason: 'Недоступно для группы элементов' },

    // Вставка - ДОСТУПНО (можно добавлять новые элементы)
    { action: 'ADD_TEXT', available: true },
    { action: 'ADD_IMAGE', available: true },
    { action: 'ADD_IMAGE_FROM_URL', available: true },
    { action: 'ADD_SHAPE', available: true },

    // Цвета - ЗАБЛОКИРОВАНО (нельзя менять цвета для группы разных типов)
    { action: 'SLIDE_BACKGROUND', available: true },
    { action: 'TEXT_COLOR', available: false, reason: 'Недоступно для группы элементов' },
    { action: 'SHAPE_FILL', available: false, reason: 'Недоступно для группы элементов' },
    { action: 'SHAPE_STROKE', available: false, reason: 'Недоступно для группы элементов' },

    // Эффекты - ЗАБЛОКИРОВАНО
    { action: 'SHAPE_STROKE_WIDTH', available: false, reason: 'Недоступно для группы элементов' },
    { action: 'TEXT_SHADOW', available: false, reason: 'Недоступно для группы элементов' },
    { action: 'SHAPE_SMOOTHING', available: false, reason: 'Недоступно для группы элементов' },

    // Дизайн - ДОСТУПНО (можно менять тему для всего слайда)
    // Все DESIGN_THEME действия доступны по умолчанию

    // Вид - ДОСТУПНО
    { action: 'TOGGLE_GRID', available: true },
  ],

  // НИЧЕГО не выбрано
  none: [
    // Главная панель
    { action: 'ADD_SLIDE', available: true },
    { action: 'DUPLICATE_SLIDE', available: true },
    { action: 'TEXT_SIZE', available: false, reason: 'Выберите текстовый элемент' },
    { action: 'TEXT_FONT', available: false, reason: 'Выберите текстовый элемент' },
    { action: 'TEXT_ALIGN', available: false, reason: 'Выберите текстовый элемент' },
    { action: 'TEXT_LINE_HEIGHT', available: false, reason: 'Выберите текстовый элемент' },
    { action: 'TEXT_BOLD', available: false, reason: 'Выберите текстовый элемент' },
    { action: 'TEXT_ITALIC', available: false, reason: 'Выберите текстовый элемент' },
    { action: 'TEXT_UNDERLINE', available: false, reason: 'Выберите текстовый элемент' },
    { action: 'LIST_OPTIONS', available: false, reason: 'Выберите текстовый элемент' },

    // Вставка
    { action: 'ADD_TEXT', available: true },
    { action: 'ADD_IMAGE', available: true },
    { action: 'ADD_IMAGE_FROM_URL', available: true },
    { action: 'ADD_SHAPE', available: true },

    // Цвета
    { action: 'SLIDE_BACKGROUND', available: true },
    { action: 'TEXT_COLOR', available: false, reason: 'Выберите текстовый элемент' },
    { action: 'SHAPE_FILL', available: false, reason: 'Выберите фигуру' },
    { action: 'SHAPE_STROKE', available: false, reason: 'Выберите фигуру' },

    // Эффекты
    { action: 'SHAPE_STROKE_WIDTH', available: false, reason: 'Выберите фигуру' },
    { action: 'TEXT_SHADOW', available: false, reason: 'Выберите текстовый элемент' },
    { action: 'SHAPE_SMOOTHING', available: false, reason: 'Выберите фигуру' },

    // Вид
    { action: 'TOGGLE_GRID', available: true },
  ],
};

// Функция для проверки доступности кнопки
export function isButtonAvailable(selectionType: SelectionType, action: string): boolean {
  const config = availabilityConfig[selectionType];
  const buttonConfig = config.find((item) => item.action === action);

  // Если кнопка явно указана в конфиге - возвращаем ее настройку
  if (buttonConfig) {
    return buttonConfig.available;
  }

  // Если кнопка не указана в конфиге - по умолчанию доступна
  return true;
}

// Функция для получения причины блокировки
export function getButtonDisabledReason(
  selectionType: SelectionType,
  action: string
): string | undefined {
  const config = availabilityConfig[selectionType];
  const buttonConfig = config.find((item) => item.action === action);

  return buttonConfig?.reason;
}

// Функция для определения типа выбора на основе выбранных элементов
export function getSelectionType(selectedElements: SlideElement[]): SelectionType {
  if (selectedElements.length === 0) {
    return 'none';
  }

  if (selectedElements.length === 1) {
    const element = selectedElements[0];

    // Проверяем тип элемента
    if (element.type === 'text') return 'text';
    if (element.type === 'image') return 'image';
    if (element.type === 'shape') return 'shape';
    // slide не может быть среди элементов слайда, это отдельный тип

    // Все остальное - other
    return 'other';
  }

  // Множественный выбор
  const types = new Set(
    selectedElements.map((el) => {
      if (el.type === 'text') return 'text';
      if (el.type === 'image') return 'image';
      if (el.type === 'shape') return 'shape';
      return 'other';
    })
  );

  // Если все элементы одного типа
  if (types.size === 1) {
    return Array.from(types)[0] as SelectionType;
  }

  // Разные типы
  return 'multiple';
}
