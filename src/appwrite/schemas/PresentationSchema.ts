export const presentationSchema = {
  type: 'object',
  required: ['title', 'slides', 'ownerId', 'ownerName'],
  properties: {
    $id: { type: 'string' },
    $createdAt: { type: 'string' },
    $updatedAt: { type: 'string' },
    $permissions: { type: 'array' },
    $collectionId: { type: 'string' },
    $databaseId: { type: 'string' },

    id: { type: 'string' },
    title: {
      type: 'string',
      minLength: 1,
      maxLength: 255,
    },
    slides: {
      anyOf: [
        {
          type: 'string',
          minLength: 2,
        },
        {
          type: 'array',
          minItems: 1,
        },
      ],
    },
    currentSlideId: {
      type: 'string',
      maxLength: 255,
    },
    selectedSlideIds: {
      anyOf: [
        {
          type: 'string',
          minLength: 2,
        },
        {
          type: 'array',
          items: { type: 'string', minLength: 1 },
        },
      ],
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
  additionalProperties: true,
} as const;

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
          required: ['id', 'type'],
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

            content: { type: 'string' },
            placeholder: { type: 'string' },
            position: {
              type: 'object',
              properties: {
                x: { type: 'number' },
                y: { type: 'number' },
              },
            },
            size: {
              type: 'object',
              properties: {
                width: { type: 'number' },
                height: { type: 'number' },
              },
            },
            font: { type: 'string' },
            color: { type: 'string' },
            align: { type: 'string' },
            verticalAlign: { type: 'string' },
          },
        },
      },
    },
  },
} as const;

export const selectedSlideIdsSchema = {
  type: 'array',
  items: { type: 'string', minLength: 1 },
} as const;

export interface ValidationError {
  instancePath?: string;
  keyword: string;
  message?: string;
  params?: {
    type?: string;
    limit?: number;
    allowedValues?: string[];
    missingProperty?: string;
  };
  data?: unknown;
}

export function formatValidationErrors(errors: ValidationError[]): string {
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
          return `Поле "${field}" должно быть типа ${error.params?.type}, получено ${typeof error.data}`;
        case 'minLength':
          return `Поле "${field}" слишком короткое (минимум ${error.params?.limit} символов)`;
        case 'maxLength':
          return `Поле "${field}" слишком длинное (максимум ${error.params?.limit} символов)`;
        case 'minItems':
          return `Массив "${field}" должен содержать минимум ${error.params?.limit} элементов`;
        case 'enum':
          return `Поле "${field}" содержит недопустимое значение. Допустимые: ${error.params?.allowedValues?.join(', ')}`;
        case 'pattern':
          return `Поле "${field}" имеет неверный формат`;
        default:
          return `Ошибка в поле "${field}": ${message}`;
      }
    })
    .join('\n');
}
