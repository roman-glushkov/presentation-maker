/**
 * JSON Schema для валидации презентаций
 * Соответствует структуре Presentation и Slide
 */
export const presentationSchema = {
  type: 'object',
  required: ['title', 'slides', 'ownerId', 'ownerName'],
  properties: {
    // Основные поля документа
    $id: { type: 'string' },
    $createdAt: { type: 'string' },
    $updatedAt: { type: 'string' },
    $permissions: { type: 'array' },
    $collectionId: { type: 'string' },
    $databaseId: { type: 'string' },

    // Поля презентации
    id: { type: 'string' },
    title: {
      type: 'string',
      minLength: 1,
      maxLength: 255,
    },
    slides: {
      type: 'string', // В БД хранится как строка JSON
      minLength: 2, // Минимум "[]"
    },
    currentSlideId: {
      type: 'string',
      maxLength: 255,
    },
    selectedSlideIds: {
      type: 'string', // В БД хранится как строка JSON
      minLength: 2, // Минимум "[]"
    },
    ownerId: {
      type: 'string',
      minLength: 1,
      maxLength: 255,
    },
    ownerName: {
      type: 'string',
      minLength: 1,
      maxLength: 255,
    },
    updatedAt: { type: 'string' },
    createdAt: { type: 'string' },
  },
  additionalProperties: false, // Запрещаем лишние поля
} as const;

/**
 * Схема для проверки структуры слайдов после парсинга JSON
 */
export const slidesArraySchema = {
  type: 'array',
  minItems: 1,
  items: {
    type: 'object',
    required: ['id', 'background', 'elements'],
    properties: {
      id: { type: 'string', minLength: 1 },
      background: {
        type: 'object',
        required: ['type', 'value'],
        properties: {
          type: {
            type: 'string',
            enum: ['color', 'image', 'gradient'],
          },
          value: { type: 'string', minLength: 1 },
        },
      },
      elements: {
        type: 'array',
        items: {
          type: 'object',
          required: ['id', 'type', 'x', 'y', 'width', 'height'],
          properties: {
            id: { type: 'string', minLength: 1 },
            type: {
              type: 'string',
              enum: ['text', 'image', 'shape', 'line'],
            },
            x: { type: 'number', minimum: 0 },
            y: { type: 'number', minimum: 0 },
            width: { type: 'number', minimum: 1 },
            height: { type: 'number', minimum: 1 },
            // Дополнительные свойства в зависимости от типа
            text: { type: 'string' },
            fontSize: { type: 'number', minimum: 1 },
            fontColor: { type: 'string', pattern: '^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$' },
            fontFamily: { type: 'string' },
            url: { type: 'string' },
            shapeType: {
              type: 'string',
              enum: ['rectangle', 'circle', 'triangle'],
            },
            fillColor: { type: 'string', pattern: '^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$' },
            strokeColor: { type: 'string', pattern: '^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$' },
            strokeWidth: { type: 'number', minimum: 0 },
          },
        },
      },
    },
  },
} as const;

/**
 * Схема для массива selectedSlideIds после парсинга
 */
export const selectedSlideIdsSchema = {
  type: 'array',
  items: { type: 'string', minLength: 1 },
} as const;

/**
 * Функция для форматирования ошибок валидации в читаемый вид
 */
export function formatValidationErrors(errors: any[]): string {
  return errors
    .map((error) => {
      const field = error.instancePath
        ? error.instancePath.slice(1)
        : error.params?.missingProperty || 'документ';
      const message = error.message || 'недопустимое значение';

      switch (error.keyword) {
        case 'required':
          return `Отсутствует обязательное поле: "${field}"`;
        case 'type':
          return `Поле "${field}" должно быть типа ${error.params.type}, получено ${typeof error.data}`;
        case 'minLength':
          return `Поле "${field}" слишком короткое (минимум ${error.params.limit} символов)`;
        case 'maxLength':
          return `Поле "${field}" слишком длинное (максимум ${error.params.limit} символов)`;
        case 'minItems':
          return `Массив "${field}" должен содержать минимум ${error.params.limit} элементов`;
        case 'enum':
          return `Поле "${field}" содержит недопустимое значение. Допустимые: ${error.params.allowedValues.join(', ')}`;
        case 'pattern':
          return `Поле "${field}" имеет неверный формат`;
        default:
          return `Ошибка в поле "${field}": ${message}`;
      }
    })
    .join('\n');
}
