import { EditorState } from '../editorSlice';
import { Slide, ShapeType } from '../types/presentation';
import * as func from '../functions/presentation';
import * as temp from '../templates/presentation';
import * as sld from '../templates/slide';
import {
  findSlideById,
  updateSlideInPresentation,
  updateSelectedElements,
  updateSlideElements,
  getThemeBackground,
  findLockedThemeSlide,
  createSlideFromTemplate,
  calculateImageSize,
  isBackgroundLocked,
  generateId,
} from './editorHelpers';
import { TEXT_SHADOW_OPTIONS, SHAPE_SMOOTHING_OPTIONS } from '../../common/components/Toolbar/constants/textOptions';

type ActionHandler = (state: EditorState, action: string) => boolean;

const SLIDE_TEMPLATES: Record<string, Slide> = {
  ADD_TITLE_SLIDE: sld.slideTitle,
  ADD_TITLE_AND_OBJECT_SLIDE: sld.slideTitleAndObject,
  ADD_SECTION_HEADER_SLIDE: sld.slideSectionHeader,
  ADD_TWO_OBJECTS_SLIDE: sld.slideTwoObjects,
  ADD_COMPARISON_SLIDE: sld.slideComparison,
  ADD_JUST_HEADLINE_SLIDE: sld.slideJustHeadline,
  ADD_EMPTY_SLIDE: sld.slideEmpty,
  ADD_OBJECT_WITH_SIGNATURE_SLIDE: sld.slideObjectWithSignature,
  ADD_DRAWING_WITH_CAPTION_SLIDE: sld.slideDrawingWithCaption,
};

function parseAction(action: string): { type: string; value: string; value2?: number } {
  const parts = action.split(':');
  return {
    type: parts[0],
    value: parts[1]?.trim() || '',
    value2: parts[2] ? parseFloat(parts[2]) : undefined,
  };
}

function handleDesignTheme(state: EditorState, themeId: string): boolean {
  state.presentation.slides = state.presentation.slides.map((slide) => ({
    ...slide,
    background: getThemeBackground(themeId),
  }));
  return true;
}

function handleTextShadow(state: EditorState, shadowKey: string): boolean {
  const slide = findSlideById(state);
  const elId = state.selectedElementIds[0];
  if (!slide || !elId) return false;

  const shadowPreset = TEXT_SHADOW_OPTIONS.find((option) => option.key === shadowKey);
  if (!shadowPreset) return false;

  updateSelectedElements(state, slide.id, state.selectedElementIds, (el) => ({
    ...el,
    shadow:
      shadowKey === 'none'
        ? undefined
        : { color: shadowPreset.color, blur: shadowPreset.blur },
  }));
  return true;
}

function handleShapeSmoothing(state: EditorState, smoothingKey: string): boolean {
  const slide = findSlideById(state);
  const elId = state.selectedElementIds[0];
  if (!slide || !elId) return false;

  const smoothingPreset = SHAPE_SMOOTHING_OPTIONS.find((option) => option.key === smoothingKey);
  if (!smoothingPreset) return false;

  updateSelectedElements(state, slide.id, state.selectedElementIds, (el) => ({
    ...el,
    smoothing: smoothingPreset.value,
  }));
  return true;
}

function handleTextReflection(state: EditorState, reflectionKey: string, reflectionValue: number): boolean {
  const slide = findSlideById(state);
  const elId = state.selectedElementIds[0];
  if (!slide || !elId) return false;

  updateSelectedElements(state, slide.id, state.selectedElementIds, (el) => ({
    ...el,
    reflection: reflectionKey === 'none' ? undefined : reflectionValue,
  }));
  return true;
}

function handleBringToFront(state: EditorState): boolean {
  const slide = findSlideById(state);
  const selectedIds = state.selectedElementIds;
  if (!slide || selectedIds.length === 0) return false;

  const elements = [...slide.elements];
  const selectedElements = elements.filter((el) => selectedIds.includes(el.id));
  const otherElements = elements.filter((el) => !selectedIds.includes(el.id));
  const newElements = [...otherElements, ...selectedElements];

  updateSlideElements(state, slide.id, () => newElements);
  return true;
}

function handleSendToBack(state: EditorState): boolean {
  const slide = findSlideById(state);
  const selectedIds = state.selectedElementIds;
  if (!slide || selectedIds.length === 0) return false;

  const elements = [...slide.elements];
  const selectedElements = elements.filter((el) => selectedIds.includes(el.id));
  const otherElements = elements.filter((el) => !selectedIds.includes(el.id));
  const newElements = [...selectedElements, ...otherElements];

  updateSlideElements(state, slide.id, () => newElements);
  return true;
}

function handleAddSlideFromTemplate(state: EditorState, templateKey: string): boolean {
  const template = SLIDE_TEMPLATES[templateKey];
  if (!template) return false;

  const existingSlideWithTheme = findLockedThemeSlide(state.presentation.slides);
  const newSlide = createSlideFromTemplate(template, !!existingSlideWithTheme);

  state.presentation = func.addSlide(state.presentation, newSlide);
  state.selectedSlideId = newSlide.id;
  state.selectedSlideIds = [newSlide.id];
  state.selectedElementIds = [];
  return true;
}

function handleTextFont(state: EditorState, fontFamily: string): boolean {
  const slide = findSlideById(state);
  const elId = state.selectedElementIds[0];
  if (!slide || !elId) return false;

  updateSlideInPresentation(state, slide.id, (s) => func.changeTextFont(s, elId, fontFamily));
  return true;
}

function handleAddShape(state: EditorState, shapeType: string): boolean {
  const slide = findSlideById(state);
  if (!slide) return false;

  const shapeElement = temp.createShapeElement(shapeType as ShapeType);
  updateSlideInPresentation(state, slide.id, (s) => func.addShape(s, shapeElement));
  return true;
}

function handleShapeFill(state: EditorState, color: string): boolean {
  const slide = findSlideById(state);
  const elId = state.selectedElementIds[0];
  if (!slide || !elId) return false;

  const element = slide.elements.find((el) => el.id === elId);
  if (!element) return false;

  if (element.type === 'shape') {
    updateSlideInPresentation(state, slide.id, (s) => func.changeShapeFill(s, elId, color));
  } else if (element.type === 'text') {
    updateSlideInPresentation(state, slide.id, (s) => func.changeTextBackgroundColor(s, elId, color));
  }
  return true;
}

function handleShapeStroke(state: EditorState, color: string): boolean {
  const slide = findSlideById(state);
  const elId = state.selectedElementIds[0];
  if (!slide || !elId) return false;

  updateSlideInPresentation(state, slide.id, (s) => func.changeShapeStroke(s, elId, color));
  return true;
}

function handleShapeStrokeWidth(state: EditorState, width: number): boolean {
  const slide = findSlideById(state);
  const elId = state.selectedElementIds[0];
  if (!slide || !elId) return false;

  updateSlideInPresentation(state, slide.id, (s) => func.changeShapeStrokeWidth(s, elId, width));
  return true;
}

function handleTextSize(state: EditorState, size: number): boolean {
  const slide = findSlideById(state);
  const elId = state.selectedElementIds[0];
  if (!slide || !elId) return false;

  updateSlideInPresentation(state, slide.id, (s) => func.changeTextSize(s, elId, size));
  return true;
}

function handleTextAlignHorizontal(state: EditorState, align: string): boolean {
  const slide = findSlideById(state);
  const elId = state.selectedElementIds[0];
  if (!slide || !elId) return false;

  updateSlideInPresentation(state, slide.id, (s) =>
    func.changeTextAlignment(s, elId, align as 'left' | 'center' | 'right' | 'justify')
  );
  return true;
}

function handleTextAlignVertical(state: EditorState, vAlign: string): boolean {
  const slide = findSlideById(state);
  const elId = state.selectedElementIds[0];
  if (!slide || !elId) return false;

  updateSlideInPresentation(state, slide.id, (s) =>
    func.changeTextVerticalAlignment(s, elId, vAlign as 'top' | 'middle' | 'bottom')
  );
  return true;
}

function handleTextLineHeight(state: EditorState, lineHeight: number): boolean {
  const slide = findSlideById(state);
  const elId = state.selectedElementIds[0];
  if (!slide || !elId) return false;

  updateSlideInPresentation(state, slide.id, (s) => func.changeTextLineHeight(s, elId, lineHeight));
  return true;
}

function handleTextColor(state: EditorState, color: string): boolean {
  const slide = findSlideById(state);
  const elId = state.selectedElementIds[0];
  if (!slide || !elId) return false;

  updateSlideInPresentation(state, slide.id, (s) => func.changeTextColor(s, elId, color));
  return true;
}

function handleSlideBackground(state: EditorState, color: string): boolean {
  const slide = findSlideById(state);
  if (!slide || isBackgroundLocked(slide.background)) return false;

  updateSlideInPresentation(state, slide.id, (s) =>
    func.changeBackground(s, { type: 'color', value: color })
  );
  return true;
}

function handleTextBold(state: EditorState): boolean {
  const slide = findSlideById(state);
  const elId = state.selectedElementIds[0];
  if (!slide || !elId) return false;

  updateSelectedElements(state, slide.id, state.selectedElementIds, (el) =>
    el.type === 'text' ? { ...el, bold: !el.bold } : el
  );
  return true;
}

function handleTextItalic(state: EditorState): boolean {
  const slide = findSlideById(state);
  const elId = state.selectedElementIds[0];
  if (!slide || !elId) return false;

  updateSelectedElements(state, slide.id, state.selectedElementIds, (el) =>
    el.type === 'text' ? { ...el, italic: !el.italic } : el
  );
  return true;
}

function handleTextUnderline(state: EditorState): boolean {
  const slide = findSlideById(state);
  const elId = state.selectedElementIds[0];
  if (!slide || !elId) return false;

  updateSelectedElements(state, slide.id, state.selectedElementIds, (el) =>
    el.type === 'text' ? { ...el, underline: !el.underline } : el
  );
  return true;
}

function handleChangeFontFamily(state: EditorState): boolean {
  const slide = findSlideById(state);
  const elId = state.selectedElementIds[0];
  if (!slide || !elId) return false;

  updateSelectedElements(state, slide.id, state.selectedElementIds, (el) =>
    el.type === 'text' ? { ...el, fontFamily: 'Arial' } : el
  );
  return true;
}

function handleDeleteSelected(state: EditorState): boolean {
  const slide = findSlideById(state);
  if (!slide || state.selectedElementIds.length === 0) return false;

  updateSlideElements(state, slide.id, (elements) =>
    elements.filter((el) => !state.selectedElementIds.includes(el.id))
  );
  state.selectedElementIds = [];
  return true;
}

function handleAddText(state: EditorState): boolean {
  const slide = findSlideById(state);
  if (!slide) return false;

  updateSlideInPresentation(state, slide.id, (s) => func.addText(s, temp.createTextElement()));
  return true;
}

function handleAddImage(state: EditorState): boolean {
  const slide = findSlideById(state);
  if (!slide) return false;

  updateSlideInPresentation(state, slide.id, (s) => func.addImage(s, temp.createImageElement()));
  return true;
}

function handleDuplicateSlide(state: EditorState): boolean {
  const slide = findSlideById(state);
  if (!slide) return false;

  const duplicatedSlide = {
    ...slide,
    id: generateId('slide'),
    elements: slide.elements.map((el) => ({ ...el, id: `${el.id}-copy-${Date.now()}` })),
  };

  state.presentation = func.addSlide(state.presentation, duplicatedSlide);
  state.selectedSlideId = duplicatedSlide.id;
  state.selectedSlideIds = [duplicatedSlide.id];
  state.selectedElementIds = [];
  return true;
}

const ACTION_HANDLERS: Record<string, ActionHandler> = {
  DESIGN_THEME: (state, action) => {
    const { value } = parseAction(action);
    return handleDesignTheme(state, value);
  },
  TEXT_SHADOW: (state, action) => {
    const { value } = parseAction(action);
    return handleTextShadow(state, value);
  },
  SHAPE_SMOOTHING: (state, action) => {
    const { value } = parseAction(action);
    return handleShapeSmoothing(state, value);
  },
  TEXT_REFLECTION: (state, action) => {
    const { value, value2 } = parseAction(action);
    return handleTextReflection(state, value, value2 || 0);
  },
  BRING_TO_FRONT: () => false, // handled separately
  SEND_TO_BACK: () => false, // handled separately
  TEXT_FONT: (state, action) => {
    const { value } = parseAction(action);
    return handleTextFont(state, value);
  },
  ADD_SHAPE: (state, action) => {
    const { value } = parseAction(action);
    return handleAddShape(state, value);
  },
  SHAPE_FILL: (state, action) => {
    const { value } = parseAction(action);
    return handleShapeFill(state, value);
  },
  SHAPE_STROKE: (state, action) => {
    const { value } = parseAction(action);
    return handleShapeStroke(state, value);
  },
  SHAPE_STROKE_WIDTH: (state, action) => {
    const { value } = parseAction(action);
    return handleShapeStrokeWidth(state, parseInt(value, 10));
  },
  TEXT_SIZE: (state, action) => {
    const { value } = parseAction(action);
    return handleTextSize(state, parseInt(value, 10));
  },
  TEXT_ALIGN_HORIZONTAL: (state, action) => {
    const { value } = parseAction(action);
    return handleTextAlignHorizontal(state, value);
  },
  TEXT_ALIGN_VERTICAL: (state, action) => {
    const { value } = parseAction(action);
    return handleTextAlignVertical(state, value);
  },
  TEXT_LINE_HEIGHT: (state, action) => {
    const { value } = parseAction(action);
    return handleTextLineHeight(state, parseFloat(value));
  },
  TEXT_COLOR: (state, action) => {
    const { value } = parseAction(action);
    return handleTextColor(state, value);
  },
  SLIDE_BACKGROUND: (state, action) => {
    const { value } = parseAction(action);
    return handleSlideBackground(state, value);
  },
  TEXT_BOLD: () => false, // handled separately
  TEXT_ITALIC: () => false, // handled separately
  TEXT_UNDERLINE: () => false, // handled separately
  CHANGE_FONT_FAMILY: () => false, // handled separately
  DELETE_SELECTED: () => false, // handled separately
  ADD_TEXT: () => false, // handled separately
  ADD_IMAGE: () => false, // handled separately
  DUPLICATE_SLIDE: () => false, // handled separately
};

export function handleAction(state: EditorState, action: string): boolean {
  const parsed = parseAction(action);
  const handler = ACTION_HANDLERS[parsed.type];

  if (handler) {
    return handler(state, action);
  }

  // Handle simple actions without parameters
  switch (action) {
    case 'BRING_TO_FRONT':
      return handleBringToFront(state);
    case 'SEND_TO_BACK':
      return handleSendToBack(state);
    case 'TEXT_BOLD':
      return handleTextBold(state);
    case 'TEXT_ITALIC':
      return handleTextItalic(state);
    case 'TEXT_UNDERLINE':
      return handleTextUnderline(state);
    case 'CHANGE_FONT_FAMILY':
      return handleChangeFontFamily(state);
    case 'DELETE_SELECTED':
      return handleDeleteSelected(state);
    case 'ADD_TEXT':
      return handleAddText(state);
    case 'ADD_IMAGE':
      return handleAddImage(state);
    case 'DUPLICATE_SLIDE':
      return handleDuplicateSlide(state);
    default:
      // Handle slide templates
      if (SLIDE_TEMPLATES[action]) {
        return handleAddSlideFromTemplate(state, action);
      }
      return false;
  }
}
