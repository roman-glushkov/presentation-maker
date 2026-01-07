import { EditorState } from '../editorSlice';
import { Slide } from '../types/presentation';
import * as sld from '../templates/slide';
import * as func from '../functions/presentation';
import * as temp from '../templates/presentation';

export function handleSlideAction(state: EditorState, action: string) {
  const slideId = state.selectedSlideId;
  const slide = state.presentation.slides.find((s: Slide) => s.id === slideId);
  const currentSelectedElementIds = [...state.selectedElementIds];

  const slideMap: Record<string, Slide> = {
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

  if (slideMap[action]) {
    const templateSlide = slideMap[action];
    const existingSlideWithTheme = state.presentation.slides.find(
      (s: Slide) =>
        s.background.type !== 'none' && 'isLocked' in s.background && s.background.isLocked
    );

    const newSlide = {
      ...templateSlide,
      id: `slide-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      elements: templateSlide.elements.map((el) => ({
        ...el,
        id: `${el.type}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        ...(el.type === 'text' && { content: '' }),
      })),
      ...(existingSlideWithTheme && {
        background: { ...existingSlideWithTheme.background },
      }),
    };

    state.presentation = func.addSlide(state.presentation, newSlide);
    state.selectedSlideId = newSlide.id;
    state.selectedSlideIds = [newSlide.id];
    state.selectedElementIds = [];
    return true;
  }

  if (action.startsWith('SLIDE_BACKGROUND:')) {
    const color = action.split(':')[1];
    if (slide) {
      if (
        slide.background.type !== 'none' &&
        'isLocked' in slide.background &&
        slide.background.isLocked
      ) {
        console.warn('Фон заблокирован и не может быть изменен');
        return true;
      }

      state.presentation.slides = state.presentation.slides.map((s: Slide) =>
        s.id === slide.id ? func.changeBackground(s, { type: 'color', value: color }) : s
      );
    }
    return true;
  }

  if (action === 'DELETE_SELECTED' && slide && currentSelectedElementIds.length > 0) {
    state.presentation.slides = state.presentation.slides.map((s: Slide) =>
      s.id === slide.id
        ? {
            ...s,
            elements: s.elements.filter((el) => !state.selectedElementIds.includes(el.id)),
          }
        : s
    );

    state.selectedElementIds = [];
    return true;
  }

  if (action === 'ADD_TEXT' && slide) {
    state.presentation.slides = state.presentation.slides.map((s: Slide) =>
      s.id === slide.id ? func.addText(s, temp.createTextElement()) : s
    );
    return true;
  }

  if (action === 'ADD_IMAGE' && slide) {
    state.presentation.slides = state.presentation.slides.map((s: Slide) =>
      s.id === slide.id ? func.addImage(s, temp.createImageElement()) : s
    );
    return true;
  }

  if (action === 'DUPLICATE_SLIDE' && slide) {
    const duplicatedSlide = {
      ...slide,
      id: `slide-${Date.now()}`,
      elements: slide.elements.map((el) => ({ ...el, id: `${el.id}-copy-${Date.now()}` })),
    };
    state.presentation = func.addSlide(state.presentation, duplicatedSlide);
    state.selectedSlideId = duplicatedSlide.id;
    state.selectedSlideIds = [duplicatedSlide.id];
    state.selectedElementIds = [];
    return true;
  }

  return false;
}
