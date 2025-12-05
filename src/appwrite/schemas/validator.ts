import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import {
  presentationSchema,
  slidesArraySchema,
  selectedSlideIdsSchema,
  formatValidationErrors,
} from './presentation-schema';

// Инициализация Ajv с поддержкой форматов
const ajv = new Ajv({
  allErrors: true, // Показывать все ошибки, а не только первую
  strict: true, // Строгая проверка схемы
  coerceTypes: false, // Не пытаться преобразовывать типы
  removeAdditional: false, // Не удалять лишние поля
  useDefaults: false, // Не использовать значения по умолчанию
});

// Добавляем поддержку форматов (даты, email и т.д.)
addFormats(ajv);

// Компилируем схемы для производительности
const validatePresentationStructure = ajv.compile(presentationSchema);
const validateSlidesArray = ajv.compile(slidesArraySchema);
const validateSelectedSlideIds = ajv.compile(selectedSlideIdsSchema);

/**
 * Основная функция валидации презентации
 * Проверяет документ из Appwrite и его содержимое
 */
export default function validatePresentation(data: any): {
  isValid: boolean;
  errors?: string[];
  formattedError?: string;
  parsedData?: {
    slides: any[];
    selectedSlideIds: string[];
  };
} {
  const errors: string[] = [];

  // 1. Проверка структуры документа
  if (!validatePresentationStructure(data)) {
    const docErrors = validatePresentationStructure.errors || [];
    errors.push('Невалидная структура документа:');
    errors.push(...docErrors.map((e) => `  - ${e.instancePath || 'root'}: ${e.message}`));
  }

  // 2. Проверка что slides - валидный JSON
  let parsedSlides: any[] = [];
  if (data.slides && typeof data.slides === 'string') {
    try {
      parsedSlides = JSON.parse(data.slides);

      // Проверка структуры слайдов
      if (!validateSlidesArray(parsedSlides)) {
        const slideErrors = validateSlidesArray.errors || [];
        errors.push('Невалидная структура слайдов:');
        errors.push(...slideErrors.map((e) => `  - slides${e.instancePath}: ${e.message}`));
      }
    } catch (parseError) {
      errors.push(
        `Ошибка парсинга поля slides: ${parseError instanceof Error ? parseError.message : 'Неизвестная ошибка'}`
      );
    }
  } else if (data.slides !== undefined && data.slides !== null) {
    errors.push('Поле slides должно быть строкой (JSON)');
  }

  // 3. Проверка что selectedSlideIds - валидный JSON
  let parsedSelectedSlideIds: string[] = [];
  if (data.selectedSlideIds && typeof data.selectedSlideIds === 'string') {
    try {
      parsedSelectedSlideIds = JSON.parse(data.selectedSlideIds);

      // Проверка структуры selectedSlideIds
      if (!validateSelectedSlideIds(parsedSelectedSlideIds)) {
        const idsErrors = validateSelectedSlideIds.errors || [];
        errors.push('Невалидная структура selectedSlideIds:');
        errors.push(...idsErrors.map((e) => `  - selectedSlideIds${e.instancePath}: ${e.message}`));
      }
    } catch (parseError) {
      errors.push(
        `Ошибка парсинга поля selectedSlideIds: ${parseError instanceof Error ? parseError.message : 'Неизвестная ошибка'}`
      );
    }
  } else if (data.selectedSlideIds !== undefined && data.selectedSlideIds !== null) {
    errors.push('Поле selectedSlideIds должно быть строкой (JSON)');
  }

  // 4. Проверка что currentSlideId существует в slides
  if (data.currentSlideId && parsedSlides.length > 0) {
    const slideExists = parsedSlides.some((slide) => slide.id === data.currentSlideId);
    if (!slideExists) {
      errors.push(`currentSlideId "${data.currentSlideId}" не найден среди слайдов`);
    }
  }

  // 5. Проверка что все selectedSlideIds существуют в slides
  if (parsedSelectedSlideIds.length > 0 && parsedSlides.length > 0) {
    const invalidIds = parsedSelectedSlideIds.filter(
      (id) => !parsedSlides.some((slide) => slide.id === id)
    );
    if (invalidIds.length > 0) {
      errors.push(`Некорректные ID в selectedSlideIds: ${invalidIds.join(', ')}`);
    }
  }

  if (errors.length > 0) {
    return {
      isValid: false,
      errors,
      formattedError:
        formatValidationErrors(validatePresentationStructure.errors || []) +
        '\n' +
        errors.join('\n'),
    };
  }

  return {
    isValid: true,
    parsedData: {
      slides: parsedSlides,
      selectedSlideIds: parsedSelectedSlideIds,
    },
  };
}

/**
 * Валидация при сохранении (опционально)
 */
export function validatePresentationForSave(presentation: any): boolean {
  // Проверяем основные обязательные поля
  if (!presentation.title || typeof presentation.title !== 'string') {
    throw new Error('Поле title обязательно и должно быть строкой');
  }

  if (!presentation.slides || !Array.isArray(presentation.slides)) {
    throw new Error('Поле slides обязательно и должно быть массивом');
  }

  if (presentation.slides.length === 0) {
    throw new Error('Презентация должна содержать хотя бы один слайд');
  }

  return true;
}
