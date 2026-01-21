export type SelectionType = 'shape' | 'text' | 'image' | 'slide' | 'multiple' | 'other' | 'none';

export interface ButtonAvailability {
  action: string;
  available: boolean;
  reason?: string;
}

const REASON_SELECT_TEXT = 'Выберите текстовый элемент';
const REASON_SELECT_SHAPE = 'Выберите фигуру';
const REASON_SELECT_OTHER = 'Выберите другой элемент';
const REASON_NOT_FOR_GROUP = 'Недоступно для группы элементов';

export const BASE_BUTTONS: ButtonAvailability[] = [
  { action: 'ADD_SLIDE', available: true },
  { action: 'DUPLICATE_SLIDE', available: true },
  { action: 'ADD_TEXT', available: true },
  { action: 'ADD_IMAGE', available: true },
  { action: 'ADD_IMAGE_FROM_URL', available: true },
  { action: 'ADD_SHAPE', available: true },
  { action: 'SLIDE_BACKGROUND', available: true },
  { action: 'TOGGLE_GRID', available: true },
];

export const availabilityConfig: Record<SelectionType, ButtonAvailability[]> = {
  shape: [
    ...BASE_BUTTONS,
    { action: 'TEXT_SIZE', available: false, reason: REASON_SELECT_TEXT },
    { action: 'TEXT_FONT', available: false, reason: REASON_SELECT_TEXT },
    { action: 'TEXT_ALIGN', available: false, reason: REASON_SELECT_TEXT },
    { action: 'TEXT_LINE_HEIGHT', available: false, reason: REASON_SELECT_TEXT },
    { action: 'TEXT_BOLD', available: false, reason: REASON_SELECT_TEXT },
    { action: 'TEXT_ITALIC', available: false, reason: REASON_SELECT_TEXT },
    { action: 'TEXT_UNDERLINE', available: false, reason: REASON_SELECT_TEXT },
    { action: 'LIST_OPTIONS', available: false, reason: REASON_SELECT_TEXT },
    { action: 'TEXT_COLOR', available: false, reason: REASON_SELECT_TEXT },
    { action: 'SHAPE_FILL', available: true },
    { action: 'SHAPE_STROKE', available: true },
    { action: 'SHAPE_STROKE_WIDTH', available: true },
    { action: 'TEXT_SHADOW', available: true },
    { action: 'SHAPE_SMOOTHING', available: false, reason: REASON_SELECT_OTHER },
  ],

  text: [
    ...BASE_BUTTONS,
    { action: 'TEXT_SIZE', available: true },
    { action: 'TEXT_FONT', available: true },
    { action: 'TEXT_ALIGN', available: true },
    { action: 'TEXT_LINE_HEIGHT', available: true },
    { action: 'TEXT_BOLD', available: true },
    { action: 'TEXT_ITALIC', available: true },
    { action: 'TEXT_UNDERLINE', available: true },
    { action: 'LIST_OPTIONS', available: true },
    { action: 'TEXT_COLOR', available: true },
    { action: 'SHAPE_FILL', available: true },
    { action: 'SHAPE_STROKE', available: false, reason: REASON_SELECT_SHAPE },
    { action: 'SHAPE_STROKE_WIDTH', available: false, reason: REASON_SELECT_SHAPE },
    { action: 'TEXT_SHADOW', available: true },
    { action: 'SHAPE_SMOOTHING', available: true },
  ],

  image: [
    ...BASE_BUTTONS,
    { action: 'TEXT_SIZE', available: false, reason: REASON_SELECT_TEXT },
    { action: 'TEXT_FONT', available: false, reason: REASON_SELECT_TEXT },
    { action: 'TEXT_ALIGN', available: false, reason: REASON_SELECT_TEXT },
    { action: 'TEXT_LINE_HEIGHT', available: false, reason: REASON_SELECT_TEXT },
    { action: 'TEXT_BOLD', available: false, reason: REASON_SELECT_TEXT },
    { action: 'TEXT_ITALIC', available: false, reason: REASON_SELECT_TEXT },
    { action: 'TEXT_UNDERLINE', available: false, reason: REASON_SELECT_TEXT },
    { action: 'LIST_OPTIONS', available: false, reason: REASON_SELECT_TEXT },
    { action: 'TEXT_COLOR', available: false, reason: REASON_SELECT_TEXT },
    { action: 'SHAPE_FILL', available: false, reason: REASON_SELECT_SHAPE },
    { action: 'SHAPE_STROKE', available: false, reason: REASON_SELECT_SHAPE },
    { action: 'SHAPE_STROKE_WIDTH', available: false, reason: REASON_SELECT_SHAPE },
    { action: 'TEXT_SHADOW', available: true },
    { action: 'SHAPE_SMOOTHING', available: true },
  ],

  slide: [
    ...BASE_BUTTONS,
    { action: 'TEXT_SIZE', available: false, reason: REASON_SELECT_TEXT },
    { action: 'TEXT_FONT', available: false, reason: REASON_SELECT_TEXT },
    { action: 'TEXT_ALIGN', available: false, reason: REASON_SELECT_TEXT },
    { action: 'TEXT_LINE_HEIGHT', available: false, reason: REASON_SELECT_TEXT },
    { action: 'TEXT_BOLD', available: false, reason: REASON_SELECT_TEXT },
    { action: 'TEXT_ITALIC', available: false, reason: REASON_SELECT_TEXT },
    { action: 'TEXT_UNDERLINE', available: false, reason: REASON_SELECT_TEXT },
    { action: 'LIST_OPTIONS', available: false, reason: REASON_SELECT_TEXT },
    { action: 'TEXT_COLOR', available: false, reason: REASON_SELECT_TEXT },
    { action: 'SHAPE_FILL', available: false, reason: REASON_SELECT_SHAPE },
    { action: 'SHAPE_STROKE', available: false, reason: REASON_SELECT_SHAPE },
    { action: 'SHAPE_STROKE_WIDTH', available: false, reason: REASON_SELECT_SHAPE },
    { action: 'TEXT_SHADOW', available: false, reason: REASON_SELECT_TEXT },
    { action: 'SHAPE_SMOOTHING', available: false, reason: REASON_SELECT_SHAPE },
  ],

  other: [
    ...BASE_BUTTONS,
    { action: 'TEXT_SIZE', available: false, reason: REASON_SELECT_TEXT },
    { action: 'TEXT_FONT', available: false, reason: REASON_SELECT_TEXT },
    { action: 'TEXT_ALIGN', available: false, reason: REASON_SELECT_TEXT },
    { action: 'TEXT_LINE_HEIGHT', available: false, reason: REASON_SELECT_TEXT },
    { action: 'TEXT_BOLD', available: false, reason: REASON_SELECT_TEXT },
    { action: 'TEXT_ITALIC', available: false, reason: REASON_SELECT_TEXT },
    { action: 'TEXT_UNDERLINE', available: false, reason: REASON_SELECT_TEXT },
    { action: 'LIST_OPTIONS', available: false, reason: REASON_SELECT_TEXT },
    { action: 'TEXT_COLOR', available: false, reason: REASON_SELECT_TEXT },
    { action: 'SHAPE_FILL', available: false, reason: REASON_SELECT_SHAPE },
    { action: 'SHAPE_STROKE', available: false, reason: REASON_SELECT_SHAPE },
    { action: 'SHAPE_STROKE_WIDTH', available: false, reason: REASON_SELECT_SHAPE },
    { action: 'TEXT_SHADOW', available: false, reason: REASON_SELECT_TEXT },
    { action: 'SHAPE_SMOOTHING', available: false, reason: REASON_SELECT_SHAPE },
  ],

  multiple: [
    ...BASE_BUTTONS,
    { action: 'TEXT_SIZE', available: false, reason: REASON_NOT_FOR_GROUP },
    { action: 'TEXT_FONT', available: false, reason: REASON_NOT_FOR_GROUP },
    { action: 'TEXT_ALIGN', available: false, reason: REASON_NOT_FOR_GROUP },
    { action: 'TEXT_LINE_HEIGHT', available: false, reason: REASON_NOT_FOR_GROUP },
    { action: 'TEXT_BOLD', available: false, reason: REASON_NOT_FOR_GROUP },
    { action: 'TEXT_ITALIC', available: false, reason: REASON_NOT_FOR_GROUP },
    { action: 'TEXT_UNDERLINE', available: false, reason: REASON_NOT_FOR_GROUP },
    { action: 'LIST_OPTIONS', available: false, reason: REASON_NOT_FOR_GROUP },
    { action: 'TEXT_COLOR', available: false, reason: REASON_NOT_FOR_GROUP },
    { action: 'SHAPE_FILL', available: false, reason: REASON_NOT_FOR_GROUP },
    { action: 'SHAPE_STROKE', available: false, reason: REASON_NOT_FOR_GROUP },
    { action: 'SHAPE_STROKE_WIDTH', available: false, reason: REASON_NOT_FOR_GROUP },
    { action: 'TEXT_SHADOW', available: false, reason: REASON_NOT_FOR_GROUP },
    { action: 'SHAPE_SMOOTHING', available: false, reason: REASON_NOT_FOR_GROUP },
  ],

  none: [
    ...BASE_BUTTONS,
    { action: 'TEXT_SIZE', available: false, reason: REASON_SELECT_TEXT },
    { action: 'TEXT_FONT', available: false, reason: REASON_SELECT_TEXT },
    { action: 'TEXT_ALIGN', available: false, reason: REASON_SELECT_TEXT },
    { action: 'TEXT_LINE_HEIGHT', available: false, reason: REASON_SELECT_TEXT },
    { action: 'TEXT_BOLD', available: false, reason: REASON_SELECT_TEXT },
    { action: 'TEXT_ITALIC', available: false, reason: REASON_SELECT_TEXT },
    { action: 'TEXT_UNDERLINE', available: false, reason: REASON_SELECT_TEXT },
    { action: 'LIST_OPTIONS', available: false, reason: REASON_SELECT_TEXT },
    { action: 'TEXT_COLOR', available: false, reason: REASON_SELECT_TEXT },
    { action: 'SHAPE_FILL', available: false, reason: REASON_SELECT_SHAPE },
    { action: 'SHAPE_STROKE', available: false, reason: REASON_SELECT_SHAPE },
    { action: 'SHAPE_STROKE_WIDTH', available: false, reason: REASON_SELECT_SHAPE },
    { action: 'TEXT_SHADOW', available: false, reason: REASON_SELECT_TEXT },
    { action: 'SHAPE_SMOOTHING', available: false, reason: REASON_SELECT_SHAPE },
  ],
};
