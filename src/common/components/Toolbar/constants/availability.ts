import { SlideElement } from '../../../../store/types/presentation';
export type SelectionType = 'shape' | 'text' | 'image' | 'slide' | 'multiple' | 'other' | 'none';
export interface ButtonAvailability {
  action: string;
  available: boolean;
  reason?: string;
}

export const availabilityConfig: Record<SelectionType, ButtonAvailability[]> = {
  shape: [
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
    { action: 'ADD_TEXT', available: true },
    { action: 'ADD_IMAGE', available: true },
    { action: 'ADD_IMAGE_FROM_URL', available: true },
    { action: 'ADD_SHAPE', available: true },
    { action: 'SLIDE_BACKGROUND', available: true },
    { action: 'TEXT_COLOR', available: false, reason: 'Выберите текстовый элемент' },
    { action: 'SHAPE_FILL', available: true },
    { action: 'SHAPE_STROKE', available: true },
    { action: 'SHAPE_STROKE_WIDTH', available: true },
    { action: 'TEXT_SHADOW', available: false, reason: 'Выберите текстовый элемент' },
    { action: 'SHAPE_SMOOTHING', available: false, reason: 'Выберите другой элемент' },
    { action: 'TOGGLE_GRID', available: true },
  ],

  text: [
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
    { action: 'ADD_TEXT', available: true },
    { action: 'ADD_IMAGE', available: true },
    { action: 'ADD_IMAGE_FROM_URL', available: true },
    { action: 'ADD_SHAPE', available: true },
    { action: 'SLIDE_BACKGROUND', available: true },
    { action: 'TEXT_COLOR', available: true },
    { action: 'SHAPE_FILL', available: true },
    { action: 'SHAPE_STROKE', available: false, reason: 'Выберите фигуру' },
    { action: 'SHAPE_STROKE_WIDTH', available: false, reason: 'Выберите фигуру' },
    { action: 'TEXT_SHADOW', available: true },
    { action: 'SHAPE_SMOOTHING', available: true },
    { action: 'TOGGLE_GRID', available: true },
  ],

  image: [
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
    { action: 'ADD_TEXT', available: true },
    { action: 'ADD_IMAGE', available: true },
    { action: 'ADD_IMAGE_FROM_URL', available: true },
    { action: 'ADD_SHAPE', available: true },
    { action: 'SLIDE_BACKGROUND', available: true },
    { action: 'TEXT_COLOR', available: false, reason: 'Выберите текстовый элемент' },
    { action: 'SHAPE_FILL', available: false, reason: 'Выберите фигуру' },
    { action: 'SHAPE_STROKE', available: false, reason: 'Выберите фигуру' },
    { action: 'SHAPE_STROKE_WIDTH', available: false, reason: 'Выберите фигуру' },
    { action: 'TEXT_SHADOW', available: false, reason: 'Выберите текстовый элемент' },
    { action: 'SHAPE_SMOOTHING', available: true },
    { action: 'TOGGLE_GRID', available: true },
  ],

  slide: [
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
    { action: 'ADD_TEXT', available: true },
    { action: 'ADD_IMAGE', available: true },
    { action: 'ADD_IMAGE_FROM_URL', available: true },
    { action: 'ADD_SHAPE', available: true },
    { action: 'SLIDE_BACKGROUND', available: true },
    { action: 'TEXT_COLOR', available: false, reason: 'Выберите текстовый элемент' },
    { action: 'SHAPE_FILL', available: false, reason: 'Выберите фигуру' },
    { action: 'SHAPE_STROKE', available: false, reason: 'Выберите фигуру' },
    { action: 'SHAPE_STROKE_WIDTH', available: false, reason: 'Выберите фигуру' },
    { action: 'TEXT_SHADOW', available: false, reason: 'Выберите текстовый элемент' },
    { action: 'SHAPE_SMOOTHING', available: false, reason: 'Выберите фигуру' },
    { action: 'TOGGLE_GRID', available: true },
  ],

  other: [
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
    { action: 'ADD_TEXT', available: true },
    { action: 'ADD_IMAGE', available: true },
    { action: 'ADD_IMAGE_FROM_URL', available: true },
    { action: 'ADD_SHAPE', available: true },
    { action: 'SLIDE_BACKGROUND', available: true },
    { action: 'TEXT_COLOR', available: false, reason: 'Выберите текстовый элемент' },
    { action: 'SHAPE_FILL', available: false, reason: 'Выберите фигуру' },
    { action: 'SHAPE_STROKE', available: false, reason: 'Выберите фигуру' },
    { action: 'SHAPE_STROKE_WIDTH', available: false, reason: 'Выберите фигуру' },
    { action: 'TEXT_SHADOW', available: false, reason: 'Выберите текстовый элемент' },
    { action: 'SHAPE_SMOOTHING', available: false, reason: 'Выберите фигуру' },
    { action: 'TOGGLE_GRID', available: true },
  ],

  multiple: [
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
    { action: 'ADD_TEXT', available: true },
    { action: 'ADD_IMAGE', available: true },
    { action: 'ADD_IMAGE_FROM_URL', available: true },
    { action: 'ADD_SHAPE', available: true },
    { action: 'SLIDE_BACKGROUND', available: true },
    { action: 'TEXT_COLOR', available: false, reason: 'Недоступно для группы элементов' },
    { action: 'SHAPE_FILL', available: false, reason: 'Недоступно для группы элементов' },
    { action: 'SHAPE_STROKE', available: false, reason: 'Недоступно для группы элементов' },
    { action: 'SHAPE_STROKE_WIDTH', available: false, reason: 'Недоступно для группы элементов' },
    { action: 'TEXT_SHADOW', available: false, reason: 'Недоступно для группы элементов' },
    { action: 'SHAPE_SMOOTHING', available: false, reason: 'Недоступно для группы элементов' },
    { action: 'TOGGLE_GRID', available: true },
  ],

  none: [
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
    { action: 'ADD_TEXT', available: true },
    { action: 'ADD_IMAGE', available: true },
    { action: 'ADD_IMAGE_FROM_URL', available: true },
    { action: 'ADD_SHAPE', available: true },
    { action: 'SLIDE_BACKGROUND', available: true },
    { action: 'TEXT_COLOR', available: false, reason: 'Выберите текстовый элемент' },
    { action: 'SHAPE_FILL', available: false, reason: 'Выберите фигуру' },
    { action: 'SHAPE_STROKE', available: false, reason: 'Выберите фигуру' },
    { action: 'SHAPE_STROKE_WIDTH', available: false, reason: 'Выберите фигуру' },
    { action: 'TEXT_SHADOW', available: false, reason: 'Выберите текстовый элемент' },
    { action: 'SHAPE_SMOOTHING', available: false, reason: 'Выберите фигуру' },
    { action: 'TOGGLE_GRID', available: true },
  ],
};

export function isButtonAvailable(selectionType: SelectionType, action: string): boolean {
  const config = availabilityConfig[selectionType];
  const buttonConfig = config.find((item) => item.action === action);
  if (buttonConfig) {
    return buttonConfig.available;
  }
  return true;
}

export function getButtonDisabledReason(
  selectionType: SelectionType,
  action: string
): string | undefined {
  const config = availabilityConfig[selectionType];
  const buttonConfig = config.find((item) => item.action === action);
  return buttonConfig?.reason;
}

export function getSelectionType(selectedElements: SlideElement[]): SelectionType {
  if (selectedElements.length === 0) {
    return 'none';
  }
  if (selectedElements.length === 1) {
    const element = selectedElements[0];
    if (element.type === 'text') return 'text';
    if (element.type === 'image') return 'image';
    if (element.type === 'shape') return 'shape';
    return 'other';
  }

  const types = new Set(
    selectedElements.map((el) => {
      if (el.type === 'text') return 'text';
      if (el.type === 'image') return 'image';
      if (el.type === 'shape') return 'shape';
      return 'other';
    })
  );

  if (types.size === 1) {
    return Array.from(types)[0] as SelectionType;
  }
  return 'multiple';
}
