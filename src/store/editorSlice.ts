import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Presentation, Slide, Background, SlideElement } from './types/presentation';
import * as func from './functions/presentation';
import * as sld from './templates/slide';
import { demoPresentation } from './templates/demoPresentation';
import {
  clonePresentation,
  makeSnapshot,
  findSlideById,
  updateSlideInPresentation,
  findLockedThemeSlide,
  createSlideFromTemplate,
  calculateImageSize,
  isBackgroundLocked,
  generateId,
} from './utils/editorHelpers';
import { handleAction as processAction } from './utils/actionHandlers';
import * as temp from './templates/presentation';

const initialPresentation: Presentation = {
  title: 'Новая презентация',
  slides: [sld.slideTitle],
  currentSlideId: 'slide1',
  selectedSlideIds: ['slide1'],
};

export interface EditorSnapshot {
  presentation: Presentation;
  selectedSlideId: string;
  selectedSlideIds: string[];
  selectedElementIds: string[];
}

export interface EditorState {
  presentation: Presentation;
  presentationId?: string;
  selectedSlideId: string;
  selectedSlideIds: string[];
  selectedElementIds: string[];
  slides: Slide[];
  history: {
    past: EditorSnapshot[];
    future: EditorSnapshot[];
    maxItems: number;
    transactionDepth: number;
    transactionInitial?: EditorSnapshot | null;
    transactionAction?: string | null;
  };
}

const SELECTION_ACTIONS = new Set([
  'editor/selectSlide',
  'editor/selectSlides',
  'editor/selectElement',
  'editor/selectMultipleElements',
  'editor/addToSelection',
  'editor/removeFromSelection',
  'editor/clearSelection',
  'editor/clearSlideSelection',
  'editor/clearAllSelections',
]);

const initialState: EditorState = {
  presentation: initialPresentation,
  presentationId: undefined,
  selectedSlideId: 'slide1',
  selectedSlideIds: ['slide1'],
  selectedElementIds: [],
  slides: initialPresentation.slides,
  history: {
    past: [],
    future: [],
    maxItems: 100,
    transactionDepth: 0,
    transactionInitial: null,
    transactionAction: null,
  },
};

function pushToPast(state: EditorState, actionType?: string) {
  if (actionType && SELECTION_ACTIONS.has(actionType)) return;
  if (state.history.transactionDepth > 0) return;

  const snap = makeSnapshot(state);
  state.history.past.push(snap);

  if (state.history.past.length > state.history.maxItems) {
    state.history.past.shift();
  }

  state.history.future = [];
}

export const editorSlice = createSlice({
  name: 'editor',
  initialState,
  reducers: {
    beginTransaction(state, action: PayloadAction<string | undefined>) {
      state.history.transactionDepth += 1;

      if (state.history.transactionDepth === 1) {
        state.history.transactionInitial = makeSnapshot(state);
        state.history.transactionAction = action.payload || null;
      }
    },

    endTransaction(state) {
      if (state.history.transactionDepth <= 0) return;
      state.history.transactionDepth -= 1;

      if (state.history.transactionDepth === 0) {
        const initial = state.history.transactionInitial;
        state.history.transactionInitial = null;
        const finalSnap = makeSnapshot(state);

        if (
          initial &&
          JSON.stringify(initial.presentation) !== JSON.stringify(finalSnap.presentation)
        ) {
          state.history.past.push(initial);

          if (state.history.past.length > state.history.maxItems) {
            state.history.past.shift();
          }

          state.history.future = [];
        }

        state.history.transactionAction = null;
      }
    },

    selectSlide(state, action: PayloadAction<string>) {
      const slideId = action.payload;
      state.selectedSlideId = slideId;
      state.selectedSlideIds = [slideId];
      state.selectedElementIds = [];
    },

    selectSlides(state, action: PayloadAction<string[]>) {
      if (action.payload.length > 0) {
        state.selectedSlideIds = action.payload;
        state.selectedSlideId = action.payload[0];
        state.selectedElementIds = [];
      } else {
        state.selectedSlideIds = [];
        state.selectedSlideId = '';
      }
    },

    selectElement(state, action: PayloadAction<string>) {
      const elementId = action.payload;
      state.selectedElementIds = [elementId];
      state.selectedSlideIds = [];
    },

    selectMultipleElements(state, action: PayloadAction<string[]>) {
      state.selectedElementIds = action.payload;
      state.selectedSlideIds = [];
    },

    addToSelection(state, action: PayloadAction<string>) {
      const elementId = action.payload;

      if (!state.selectedElementIds.includes(elementId)) {
        state.selectedElementIds.push(elementId);
      }

      state.selectedSlideIds = [];
    },

    removeFromSelection(state, action: PayloadAction<string>) {
      state.selectedElementIds = state.selectedElementIds.filter((id) => id !== action.payload);
    },

    clearSelection(state) {
      state.selectedElementIds = [];
    },

    clearSlideSelection(state) {
      state.selectedSlideIds = [];
    },

    clearAllSelections(state) {
      state.selectedElementIds = [];
      state.selectedSlideIds = [];
    },

    setPresentationId(state, action: PayloadAction<string | undefined>) {
      state.presentationId = action.payload;
    },

    loadDemoPresentation(state) {
      pushToPast(state, 'editor/loadDemoPresentation');
      state.presentation = clonePresentation(demoPresentation);
      state.slides = state.presentation.slides;
      state.presentationId = undefined;
      state.selectedSlideId = demoPresentation.slides[0]?.id || '';
      state.selectedSlideIds = demoPresentation.slides[0] ? [demoPresentation.slides[0].id] : [];
      state.selectedElementIds = [];
    },

    updateSlide(state, action: PayloadAction<(s: Slide) => Slide>) {
      const slideId = state.selectedSlideId;
      const oldSlide = findSlideById(state, slideId);
      if (!oldSlide) return;

      const newSlide = action.payload(
        clonePresentation({ ...state.presentation }).slides.find((s) => s.id === slideId)!
      );

      if (JSON.stringify(oldSlide) === JSON.stringify(newSlide)) return;

      pushToPast(state, 'editor/updateSlide');
      updateSlideInPresentation(state, slideId, () => newSlide);
      state.slides = state.presentation.slides;
    },

    updateTextContent(state, action: PayloadAction<{ elementId: string; content: string }>) {
      const { elementId, content } = action.payload;
      const slideId = state.selectedSlideId;
      const slide = findSlideById(state, slideId);

      if (!slide) return;

      const element = slide.elements.find((el) => el.id === elementId);
      if (!element || element.type !== 'text') return;
      if (element.content === content) return;

      pushToPast(state, 'editor/updateTextContent');
      updateSlideInPresentation(state, slideId, (s) => func.changeText(s, elementId, content));
      state.slides = state.presentation.slides;
    },

    addSlide(state, action: PayloadAction<Slide>) {
      pushToPast(state, 'editor/addSlide');

      const existingSlideWithTheme = findLockedThemeSlide(state.presentation.slides);
      const newSlide = {
        ...action.payload,
        ...(existingSlideWithTheme && { background: { ...existingSlideWithTheme.background } }),
      };

      state.presentation = func.addSlide(state.presentation, newSlide);
      state.slides = state.presentation.slides;
      state.selectedSlideId = newSlide.id;
      state.selectedSlideIds = [newSlide.id];
      state.selectedElementIds = [];
    },

    removeSlide(state, action: PayloadAction<string>) {
      pushToPast(state, 'editor/removeSlide');

      state.presentation = func.removeSlide(state.presentation, action.payload);
      state.slides = state.presentation.slides;
      state.selectedSlideId = state.presentation.slides[0]?.id || '';
      state.selectedSlideIds = state.presentation.slides[0]
        ? [state.presentation.slides[0].id]
        : [];
      state.selectedElementIds = [];
    },

    reorderSlides(state, action: PayloadAction<Slide[]>) {
      if (JSON.stringify(state.presentation.slides) === JSON.stringify(action.payload)) return;

      pushToPast(state, 'editor/reorderSlides');
      state.presentation.slides = action.payload;
      state.slides = state.presentation.slides;
    },

    changeTitle(state, action: PayloadAction<string>) {
      if (state.presentation.title === action.payload) return;

      pushToPast(state, 'editor/changeTitle');
      state.presentation.title = action.payload;
    },

    changeBackground(state, action: PayloadAction<Background>) {
      const slide = findSlideById(state);
      if (!slide || isBackgroundLocked(slide.background)) return;

      pushToPast(state, 'editor/changeBackground');
      updateSlideInPresentation(state, slide.id, (s) => func.changeBackground(s, action.payload));
      state.slides = state.presentation.slides;
    },

    addImageWithUrl(
      state,
      action: PayloadAction<string | { url: string; width: number; height: number }>
    ) {
      pushToPast(state, 'editor/addImageWithUrl');
      const slide = findSlideById(state);
      if (!slide) return;

      const imageData = action.payload;
      const imageUrl = typeof imageData === 'string' ? imageData : imageData.url;

      let size = { width: 300, height: 200 };
      if (typeof imageData !== 'string' && imageData.width && imageData.height) {
        size = calculateImageSize(imageData.width, imageData.height);
      }

      const imageElement = {
        ...temp.createImageElement(),
        src: imageUrl,
        id: generateId('image'),
        position: { x: 100, y: 100 },
        size,
      };

      updateSlideInPresentation(state, slide.id, (s) => func.addImage(s, imageElement));
      state.slides = state.presentation.slides;
    },

    createNewPresentation(state) {
      pushToPast(state, 'editor/createNewPresentation');

      const newSlideId = generateId('slide');
      const titleSlide = {
        ...sld.slideTitle,
        id: newSlideId,
        elements: sld.slideTitle.elements?.map((el) => ({
          ...el,
          id: generateId(el.type),
        })) || [],
      };

      state.presentation = {
        title: 'Новая презентация',
        slides: [titleSlide],
        currentSlideId: newSlideId,
        selectedSlideIds: [newSlideId],
      };

      state.slides = state.presentation.slides;
      state.presentationId = undefined;
      state.selectedSlideId = newSlideId;
      state.selectedSlideIds = [newSlideId];
      state.selectedElementIds = [];
    },

    duplicateElements(state, action: PayloadAction<{ elementIds: string[] }>) {
      const { elementIds } = action.payload;
      const currentSlide = findSlideById(state);

      if (!currentSlide || elementIds.length === 0) return;

      pushToPast(state, 'editor/duplicateElements');

      const elementsToDuplicate = currentSlide.elements.filter((el) => elementIds.includes(el.id));
      const newElements = elementsToDuplicate.map((el, index) => ({
        ...el,
        id: generateId(`element-${index}`),
        position: { x: el.position.x + 15, y: el.position.y + 15 },
      }));

      updateSlideInPresentation(state, currentSlide.id, (slide) => ({
        ...slide,
        elements: [...slide.elements, ...newElements],
      }));

      state.slides = state.presentation.slides;
      state.selectedElementIds = newElements.map((el) => el.id);
      state.selectedSlideIds = [];
    },

    duplicateSlide(state, action: PayloadAction<string | undefined>) {
      const slideId = action.payload || state.selectedSlideId;
      const slide = findSlideById(state, slideId);

      if (!slide) return;

      pushToPast(state, 'editor/duplicateSlide');

      const duplicatedSlide = {
        ...slide,
        id: generateId('slide'),
        elements: slide.elements.map((el) => ({
          ...el,
          id: generateId(el.type),
        })),
        background: { ...slide.background },
      };

      const slideIndex = state.presentation.slides.findIndex((s) => s.id === slideId);
      const newSlides = [...state.presentation.slides];
      newSlides.splice(slideIndex + 1, 0, duplicatedSlide);

      state.presentation.slides = newSlides;
      state.slides = state.presentation.slides;
      state.selectedSlideId = duplicatedSlide.id;
      state.selectedSlideIds = [duplicatedSlide.id];
      state.selectedElementIds = [];
    },

    loadExistingPresentation(state, action: PayloadAction<Presentation>) {
      pushToPast(state, 'editor/loadExistingPresentation');

      state.presentation = clonePresentation(action.payload);
      state.slides = state.presentation.slides;
      state.selectedSlideId = action.payload.slides[0]?.id || '';
      state.selectedSlideIds = action.payload.slides[0] ? [action.payload.slides[0].id] : [];
      state.selectedElementIds = [];
    },

    handleAction(state, action: PayloadAction<string>) {
      const actionType = action.payload.split(':')[0];
      // Сохраняем состояние ДО изменений
      pushToPast(state, `editor/handleAction/${actionType}`);
      
      // Выполняем действие
      const handled = processAction(state, action.payload);
      
      // Синхронизируем slides после изменений
      if (handled) {
        state.slides = state.presentation.slides;
      }
    },

    undo(state) {
      const past = state.history.past;
      if (past.length === 0) return;

      const last = past.pop()!;
      const currentSnap = makeSnapshot(state);
      state.history.future.push(currentSnap);

      state.presentation = clonePresentation(last.presentation);
      state.slides = state.presentation.slides;
      state.selectedSlideId = last.selectedSlideId;
      state.selectedSlideIds = [...last.selectedSlideIds];
      state.selectedElementIds = [...last.selectedElementIds];
    },

    redo(state) {
      const future = state.history.future;
      if (future.length === 0) return;

      const next = future.pop()!;
      const currentSnap = makeSnapshot(state);
      state.history.past.push(currentSnap);

      state.presentation = clonePresentation(next.presentation);
      state.slides = state.presentation.slides;
      state.selectedSlideId = next.selectedSlideId;
      state.selectedSlideIds = [...next.selectedSlideIds];
      state.selectedElementIds = [...next.selectedElementIds];
    },
  },
});

export const {
  beginTransaction,
  endTransaction,
  selectSlide,
  selectSlides,
  selectElement,
  selectMultipleElements,
  addToSelection,
  removeFromSelection,
  clearSelection,
  clearSlideSelection,
  clearAllSelections,
  setPresentationId,
  updateSlide,
  updateTextContent,
  addSlide,
  removeSlide,
  reorderSlides,
  changeTitle,
  changeBackground,
  handleAction,
  loadDemoPresentation,
  addImageWithUrl,
  undo,
  redo,
  createNewPresentation,
  loadExistingPresentation,
  duplicateElements,
  duplicateSlide,
} = editorSlice.actions;

export default editorSlice.reducer;
