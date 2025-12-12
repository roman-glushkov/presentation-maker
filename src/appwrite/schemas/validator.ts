import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import {
  presentationSchema,
  slidesArraySchema,
  selectedSlideIdsSchema,
  formatValidationErrors,
  ValidationError,
} from './presentation-schema';

const ajv = new Ajv({
  allErrors: true,
  strict: true,
  coerceTypes: false,
  removeAdditional: false,
  useDefaults: false,
});

addFormats(ajv);

const validatePresentationStructure = ajv.compile(presentationSchema);
const validateSlidesArray = ajv.compile(slidesArraySchema);
const validateSelectedSlideIds = ajv.compile(selectedSlideIdsSchema);

export default function validatePresentation(data: unknown): {
  isValid: boolean;
  errors?: string[];
  formattedError?: string;
  parsedData?: {
    slides: unknown[];
    selectedSlideIds: string[];
  };
} {
  const errors: string[] = [];

  if (!validatePresentationStructure(data)) {
    const docErrors = (validatePresentationStructure.errors as ValidationError[]) || [];
    errors.push('Невалидная структура документа:');
    errors.push(...docErrors.map((e) => `  - ${e.instancePath || 'root'}: ${e.message}`));
  }

  const typedData = data as Record<string, unknown>;

  let parsedSlides: unknown[] = [];
  if (typedData.slides && typeof typedData.slides === 'string') {
    try {
      parsedSlides = JSON.parse(typedData.slides);

      if (!validateSlidesArray(parsedSlides)) {
        const slideErrors = (validateSlidesArray.errors as ValidationError[]) || [];
        errors.push('Невалидная структура слайдов:');
        errors.push(...slideErrors.map((e) => `  - slides${e.instancePath}: ${e.message}`));
      }
    } catch (parseError: unknown) {
      errors.push(
        `Ошибка парсинга поля slides: ${parseError instanceof Error ? parseError.message : 'Неизвестная ошибка'}`
      );
    }
  } else if (typedData.slides !== undefined && typedData.slides !== null) {
    errors.push('Поле slides должно быть строкой (JSON)');
  }

  let parsedSelectedSlideIds: string[] = [];
  if (typedData.selectedSlideIds && typeof typedData.selectedSlideIds === 'string') {
    try {
      parsedSelectedSlideIds = JSON.parse(typedData.selectedSlideIds);

      if (!validateSelectedSlideIds(parsedSelectedSlideIds)) {
        const idsErrors = (validateSelectedSlideIds.errors as ValidationError[]) || [];
        errors.push('Невалидная структура selectedSlideIds:');
        errors.push(...idsErrors.map((e) => `  - selectedSlideIds${e.instancePath}: ${e.message}`));
      }
    } catch (parseError: unknown) {
      errors.push(
        `Ошибка парсинга поля selectedSlideIds: ${parseError instanceof Error ? parseError.message : 'Неизвестная ошибка'}`
      );
    }
  } else if (typedData.selectedSlideIds !== undefined && typedData.selectedSlideIds !== null) {
    errors.push('Поле selectedSlideIds должно быть строкой (JSON)');
  }

  if (typedData.currentSlideId && parsedSlides.length > 0) {
    const slideArray = parsedSlides as Array<{ id: string }>;
    const slideExists = slideArray.some((slide) => slide.id === typedData.currentSlideId);
    if (!slideExists) {
      errors.push(`currentSlideId "${typedData.currentSlideId}" не найден среди слайдов`);
    }
  }

  if (parsedSelectedSlideIds.length > 0 && parsedSlides.length > 0) {
    const slideArray = parsedSlides as Array<{ id: string }>;
    const invalidIds = parsedSelectedSlideIds.filter(
      (id) => !slideArray.some((slide) => slide.id === id)
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
        formatValidationErrors((validatePresentationStructure.errors as ValidationError[]) || []) +
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

export function validatePresentationForSave(presentation: unknown): boolean {
  const typedPresentation = presentation as Record<string, unknown>;

  if (!typedPresentation.title || typeof typedPresentation.title !== 'string') {
    throw new Error('Поле title обязательно и должно быть строкой');
  }

  if (!typedPresentation.slides || !Array.isArray(typedPresentation.slides)) {
    throw new Error('Поле slides обязательно и должно быть массивом');
  }

  if (Array.isArray(typedPresentation.slides) && typedPresentation.slides.length === 0) {
    throw new Error('Презентация должна содержать хотя бы один слайд');
  }

  return true;
}
