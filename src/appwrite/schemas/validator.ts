import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import { presentationSchema } from './presentationSchema';

const ajv = new Ajv({ allErrors: true, strict: false, coerceTypes: false });
addFormats(ajv);

const validatePresentationStructure = ajv.compile(presentationSchema);

export default function validatePresentation(data: unknown): {
  isValid: boolean;
  parsedData?: {
    slides: unknown[];
    selectedSlideIds: string[];
  };
} {
  const typedData = data as Record<string, unknown>;
  const transformedData = { ...typedData };

  if (transformedData.slides && typeof transformedData.slides === 'string') {
    try {
      transformedData.slides = JSON.parse(transformedData.slides);
    } catch {
      return { isValid: false };
    }
  }

  if (transformedData.selectedSlideIds && typeof transformedData.selectedSlideIds === 'string') {
    try {
      transformedData.selectedSlideIds = JSON.parse(transformedData.selectedSlideIds);
    } catch {
      return { isValid: false };
    }
  }

  const isValid = validatePresentationStructure(transformedData);

  if (!isValid) {
    return { isValid: false };
  }

  const slides = Array.isArray(transformedData.slides) ? transformedData.slides : [];
  const selectedSlideIds = Array.isArray(transformedData.selectedSlideIds)
    ? transformedData.selectedSlideIds
    : [];

  return {
    isValid: true,
    parsedData: { slides, selectedSlideIds },
  };
}

export function validatePresentationForSave(presentation: unknown): boolean {
  const typedPresentation = presentation as Record<string, unknown>;

  if (!typedPresentation.title || typeof typedPresentation.title !== 'string') {
    return false;
  }

  if (!typedPresentation.slides || !Array.isArray(typedPresentation.slides)) {
    return false;
  }

  return typedPresentation.slides.length > 0;
}
