import { EditorState, EditorSnapshot } from '../editorSlice';
import { Presentation, Slide, SlideElement, Background } from '../types/presentation';
import * as func from '../functions/presentation';
import * as temp from '../templates/presentation';
import { DESIGN_THEMES } from '../../common/components/Toolbar/constants/designThemes';
import { TEXT_SHADOW_OPTIONS, SHAPE_SMOOTHING_OPTIONS } from '../../common/components/Toolbar/constants/textOptions';
import * as sld from '../templates/slide';

export function clonePresentation(p: Presentation): Presentation {
  return JSON.parse(JSON.stringify(p));
}

export function makeSnapshot(state: EditorState): EditorSnapshot {
  return {
    presentation: clonePresentation(state.presentation),
    selectedSlideId: state.selectedSlideId,
    selectedSlideIds: [...state.selectedSlideIds],
    selectedElementIds: [...state.selectedElementIds],
  };
}

export function findSlideById(state: EditorState, slideId?: string): Slide | undefined {
  const id = slideId || state.selectedSlideId;
  return state.presentation.slides.find((s) => s.id === id);
}

export function updateSlideInPresentation(
  state: EditorState,
  slideId: string,
  updater: (slide: Slide) => Slide
): void {
  state.presentation.slides = state.presentation.slides.map((s) =>
    s.id === slideId ? updater(s) : s
  );
  // Синхронизируем state.slides с presentation.slides
  state.slides = state.presentation.slides;
}

export function updateSlideElements(
  state: EditorState,
  slideId: string,
  updater: (elements: SlideElement[]) => SlideElement[]
): void {
  updateSlideInPresentation(state, slideId, (slide) => ({
    ...slide,
    elements: updater(slide.elements),
  }));
}

export function updateSelectedElements(
  state: EditorState,
  slideId: string,
  selectedElementIds: string[],
  updater: (element: SlideElement) => SlideElement
): void {
  if (selectedElementIds.length === 0) return;

  updateSlideElements(state, slideId, (elements) =>
    elements.map((el) => (selectedElementIds.includes(el.id) ? updater(el) : el))
  );
}

export function getThemeBackground(themeId: string): Background {
  if (themeId === 'no_design') {
    return { type: 'color', value: '#ffffff', isLocked: false };
  }

  const theme = DESIGN_THEMES[themeId];
  if (!theme) {
    return { type: 'color', value: '#ffffff', isLocked: false };
  }

  if (theme.backgroundImage) {
    return {
      type: 'image',
      value: theme.backgroundImage,
      size: theme.backgroundSize || 'cover',
      position: theme.backgroundPosition || 'center',
      isLocked: theme.isLocked,
    };
  }

  if (theme.backgroundColor) {
    return { type: 'color', value: theme.backgroundColor, isLocked: theme.isLocked };
  }

  return { type: 'color', value: '#ffffff', isLocked: false };
}

export function findLockedThemeSlide(slides: Slide[]): Slide | undefined {
  return slides.find(
    (s) => s.background.type !== 'none' && 'isLocked' in s.background && s.background.isLocked
  );
}

export function createSlideFromTemplate(templateSlide: Slide, hasThemeLocked: boolean): Slide {
  const existingSlideWithTheme = hasThemeLocked ? sld.slideTitle : null;

  return {
    ...templateSlide,
    id: `slide-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    elements: templateSlide.elements.map((el) => ({
      ...el,
      id: `${el.type}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      ...(el.type === 'text' && { content: '' }),
    })),
    ...(existingSlideWithTheme && { background: { ...existingSlideWithTheme.background } }),
  };
}

export function calculateImageSize(
  width: number,
  height: number,
  maxWidth = 400,
  maxHeight = 300
): { width: number; height: number } {
  const aspectRatio = width / height;
  let containerWidth = width;
  let containerHeight = height;

  if (containerWidth > maxWidth) {
    containerWidth = maxWidth;
    containerHeight = maxWidth / aspectRatio;
  }

  if (containerHeight > maxHeight) {
    containerHeight = maxHeight;
    containerWidth = maxHeight * aspectRatio;
  }

  return { width: containerWidth, height: containerHeight };
}

export function isBackgroundLocked(background: Background): boolean {
  return background.type !== 'none' && 'isLocked' in background && (background.isLocked ?? false);
}

export function generateId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}
