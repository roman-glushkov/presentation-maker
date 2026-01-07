import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Presentation, Slide, Background, SlideElement } from './types/presentation';

import * as func from './functions/presentation';
import * as temp from './templates/presentation';
import * as sld from './templates/slide';
import { demoPresentation } from './templates/demoPresentation';

import { pushToPast, makeSnapshot, handleActionDispatcher } from './helperseditor';
import { undo as undoHistory, redo as redoHistory } from './helperseditor/history';

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

function clonePresentation(p: Presentation): Presentation {
  return JSON.parse(JSON.stringify(p));
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
      state.presentationId = undefined;
      state.selectedSlideId = demoPresentation.slides[0]?.id || '';
      state.selectedSlideIds = demoPresentation.slides[0] ? [demoPresentation.slides[0].id] : [];
      state.selectedElementIds = [];
    },

    updateSlide(state, action: PayloadAction<(s: Slide) => Slide>) {
      const slideId = state.selectedSlideId;
      const oldSlide = state.presentation.slides.find((s) => s.id === slideId);
      if (!oldSlide) return;

      const newSlide = action.payload(
        clonePresentation({ ...state.presentation }).slides.find((s) => s.id === slideId)!
      );

      if (JSON.stringify(oldSlide) === JSON.stringify(newSlide)) return;

      pushToPast(state, 'editor/updateSlide');
      state.presentation.slides = state.presentation.slides.map((s) =>
        s.id === slideId ? newSlide : s
      );
    },

    updateTextContent(state, action: PayloadAction<{ elementId: string; content: string }>) {
      const { elementId, content } = action.payload;
      const slideId = state.selectedSlideId;
      const slide = state.presentation.slides.find((s) => s.id === slideId);
      if (!slide) return;

      const element = slide.elements.find((el) => el.id === elementId);
      if (!element || element.type !== 'text') return;
      if (element.content === content) return;

      pushToPast(state, 'editor/updateTextContent');
      state.presentation.slides = state.presentation.slides.map((s) =>
        s.id === slideId ? func.changeText(s, elementId, content) : s
      );
    },

    addSlide(state, action: PayloadAction<Slide>) {
      pushToPast(state, 'editor/addSlide');

      const existingSlideWithTheme = state.presentation.slides.find(
        (s) => s.background.type !== 'none' && 'isLocked' in s.background && s.background.isLocked
      );

      const newSlide = {
        ...action.payload,
        ...(existingSlideWithTheme && {
          background: { ...existingSlideWithTheme.background },
        }),
      };

      state.presentation = func.addSlide(state.presentation, newSlide);
      state.selectedSlideId = newSlide.id;
      state.selectedSlideIds = [newSlide.id];
      state.selectedElementIds = [];
    },

    removeSlide(state, action: PayloadAction<string>) {
      pushToPast(state, 'editor/removeSlide');
      state.presentation = func.removeSlide(state.presentation, action.payload);
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
    },

    changeTitle(state, action: PayloadAction<string>) {
      if (state.presentation.title === action.payload) return;
      pushToPast(state, 'editor/changeTitle');
      state.presentation.title = action.payload;
    },

    changeBackground(state, action: PayloadAction<Background>) {
      const slide = state.presentation.slides.find((s) => s.id === state.selectedSlideId);
      if (!slide) return;

      if (
        slide.background.type !== 'none' &&
        'isLocked' in slide.background &&
        slide.background.isLocked
      ) {
        console.warn('Фон заблокирован и не может быть изменен');
        return;
      }

      pushToPast(state, 'editor/changeBackground');
      state.presentation.slides = state.presentation.slides.map((s) =>
        s.id === slide.id ? func.changeBackground(s, action.payload) : s
      );
    },

    addImageWithUrl(
      state,
      action: PayloadAction<
        | string
        | {
            url: string;
            width: number;
            height: number;
          }
      >
    ) {
      pushToPast(state, 'editor/addImageWithUrl');
      const slide = state.presentation.slides.find((s) => s.id === state.selectedSlideId);
      if (!slide) return;

      const imageData = action.payload;
      const imageUrl = typeof imageData === 'string' ? imageData : imageData.url;

      let containerWidth = 300;
      let containerHeight = 200;

      if (typeof imageData !== 'string' && imageData.width && imageData.height) {
        const maxWidth = 400;
        const maxHeight = 300;
        const aspectRatio = imageData.width / imageData.height;

        containerWidth = imageData.width;
        containerHeight = imageData.height;

        if (containerWidth > maxWidth) {
          containerWidth = maxWidth;
          containerHeight = maxWidth / aspectRatio;
        }

        if (containerHeight > maxHeight) {
          containerHeight = maxHeight;
          containerWidth = maxHeight * aspectRatio;
        }
      }

      const imageElement = {
        ...temp.createImageElement(),
        src: imageUrl,
        id: `image-${Date.now()}`,
        position: {
          x: 100,
          y: 100,
        },
        size: {
          width: containerWidth,
          height: containerHeight,
        },
      };

      state.presentation.slides = state.presentation.slides.map((s) =>
        s.id === slide.id ? func.addImage(s, imageElement) : s
      );
    },

    createNewPresentation(state) {
      pushToPast(state, 'editor/createNewPresentation');

      const newSlideId = `slide-${Date.now()}`;

      const titleSlide = {
        ...sld.slideTitle,
        id: newSlideId,
      };

      titleSlide.elements =
        titleSlide.elements?.map((el) => ({
          ...el,
          id: `${el.type}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        })) || [];

      state.presentation = {
        title: 'Новая презентация',
        slides: [titleSlide],
        currentSlideId: newSlideId,
        selectedSlideIds: [newSlideId],
      };

      state.presentationId = undefined;
      state.selectedSlideId = newSlideId;
      state.selectedSlideIds = [newSlideId];
      state.selectedElementIds = [];
    },

    duplicateElements(state, action: PayloadAction<{ elementIds: string[] }>) {
      const { elementIds } = action.payload;
      const currentSlide = state.presentation.slides.find((s) => s.id === state.selectedSlideId);

      if (!currentSlide || elementIds.length === 0) return;

      pushToPast(state, 'editor/duplicateElements');

      const elementsToDuplicate = currentSlide.elements.filter((el) => elementIds.includes(el.id));

      const newElements: SlideElement[] = elementsToDuplicate.map((el, index) => {
        const newId = `element-${Date.now()}-${index}-${Math.random().toString(36).substr(2, 9)}`;
        return {
          ...el,
          id: newId,
          position: {
            x: el.position.x + 15,
            y: el.position.y + 15,
          },
        };
      });

      const slideIndex = state.presentation.slides.findIndex((s) => s.id === state.selectedSlideId);

      state.presentation.slides[slideIndex] = {
        ...currentSlide,
        elements: [...currentSlide.elements, ...newElements],
      };

      state.selectedElementIds = newElements.map((el) => el.id);
      state.selectedSlideIds = [];
    },

    duplicateSlide(state, action: PayloadAction<string | undefined>) {
      const slideId = action.payload || state.selectedSlideId;
      const slide = state.presentation.slides.find((s) => s.id === slideId);

      if (!slide) return;

      pushToPast(state, 'editor/duplicateSlide');

      const duplicatedSlide = {
        ...slide,
        id: `slide-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        elements: slide.elements.map((el) => ({
          ...el,
          id: `${el.type}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        })),
        background: { ...slide.background },
      };

      const slideIndex = state.presentation.slides.findIndex((s) => s.id === slideId);
      const newSlides = [...state.presentation.slides];
      newSlides.splice(slideIndex + 1, 0, duplicatedSlide);

      state.presentation.slides = newSlides;
      state.selectedSlideId = duplicatedSlide.id;
      state.selectedSlideIds = [duplicatedSlide.id];
      state.selectedElementIds = [];
    },

    loadExistingPresentation(state, action: PayloadAction<Presentation>) {
      pushToPast(state, 'editor/loadExistingPresentation');
      state.presentation = clonePresentation(action.payload);
      state.selectedSlideId = action.payload.slides[0]?.id || '';
      state.selectedSlideIds = action.payload.slides[0] ? [action.payload.slides[0].id] : [];
      state.selectedElementIds = [];
    },

    handleAction(state, action: PayloadAction<string>) {
      const act = action.payload;

      // Используем диспетчер действий
      const actionType = handleActionDispatcher(state, act);
      if (actionType) {
        pushToPast(state, actionType);
      }
    },

    undo(state: EditorState) {
      undoHistory(state);
    },

    redo(state: EditorState) {
      redoHistory(state);
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
