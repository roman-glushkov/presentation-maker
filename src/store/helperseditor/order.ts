import { EditorState } from '../editorSlice';
import { Slide } from '../types/presentation';

export function handleOrderAction(state: EditorState, action: string) {
  const slideId = state.selectedSlideId;
  const slide = state.presentation.slides.find((s: Slide) => s.id === slideId);
  const currentSelectedElementIds = [...state.selectedElementIds];

  if (!slide || currentSelectedElementIds.length === 0) return false;

  if (action === 'BRING_TO_FRONT') {
    const elements = [...slide.elements];
    const selectedElements = elements.filter((el) => currentSelectedElementIds.includes(el.id));
    const otherElements = elements.filter((el) => !currentSelectedElementIds.includes(el.id));
    const newElements = [...otherElements, ...selectedElements];

    state.presentation.slides = state.presentation.slides.map((s: Slide) =>
      s.id === slide.id ? { ...s, elements: newElements } : s
    );
    return true;
  }

  if (action === 'SEND_TO_BACK') {
    const elements = [...slide.elements];
    const selectedElements = elements.filter((el) => currentSelectedElementIds.includes(el.id));
    const otherElements = elements.filter((el) => !currentSelectedElementIds.includes(el.id));
    const newElements = [...selectedElements, ...otherElements];

    state.presentation.slides = state.presentation.slides.map((s: Slide) =>
      s.id === slide.id ? { ...s, elements: newElements } : s
    );
    return true;
  }

  return false;
}
