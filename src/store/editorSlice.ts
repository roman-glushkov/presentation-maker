// src/store/editorSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Presentation, Slide, Background } from './types/presentation';
import * as func from './functions/presentation';
import * as temp from './templates/presentation';
import * as sld from './templates/slide';
import { demoPresentation } from './templates/demoPresentation';

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
  selectedSlideId: string;
  selectedSlideIds: string[];
  selectedElementIds: string[];
  slides: Slide[];

  history: {
    past: EditorSnapshot[]; // каждый snapshot — глубокая копия
    future: EditorSnapshot[];
    maxItems: number;

    transactionDepth: number; // для atomic транзакций (drag, resize, text-edit)
    transactionInitial?: EditorSnapshot | null;
    transactionAction?: string | null;
  };
}

const initialState: EditorState = {
  presentation: initialPresentation,
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

// Функции помощи

function clonePresentation(p: Presentation): Presentation {
  // Глубокое клонирование через JSON — простое и рабочее в нашем контексте
  return JSON.parse(JSON.stringify(p));
}

function makeSnapshot(state: EditorState): EditorSnapshot {
  return {
    presentation: clonePresentation(state.presentation),
    selectedSlideId: state.selectedSlideId,
    selectedSlideIds: [...state.selectedSlideIds],
    selectedElementIds: [...state.selectedElementIds],
  };
}

// Список действий, которые НЕ должны попадать в историю (selection / UI)
const SELECTION_ACTIONS = new Set([
  'editor/selectSlide',
  'editor/selectSlides',
  'editor/selectElement',
  'editor/selectMultipleElements',
  'editor/addToSelection',
  'editor/removeFromSelection',
  'editor/clearSelection',
]);

function pushToPast(state: EditorState, actionType?: string) {
  // Не сохраняем selection-actions и не пишем если мы внутри транзакции
  if (actionType && SELECTION_ACTIONS.has(actionType)) return;
  if (state.history.transactionDepth > 0) return;

  const snap = makeSnapshot(state);
  state.history.past.push(snap);
  if (state.history.past.length > state.history.maxItems) {
    state.history.past.shift();
  }
  // новая правка обнуляет future
  state.history.future = [];
}

export const editorSlice = createSlice({
  name: 'editor',
  initialState,
  reducers: {
    // ----------------------
    // TRANSACTION CONTROLS (atomic)
    // ----------------------
    beginTransaction(state, action: PayloadAction<string | undefined>) {
      state.history.transactionDepth += 1;
      if (state.history.transactionDepth === 1) {
        // сохраняем initial snapshot (глубокая копия)
        state.history.transactionInitial = makeSnapshot(state);
        state.history.transactionAction = action.payload || null;
      }
    },

    endTransaction(state) {
      if (state.history.transactionDepth <= 0) return;
      state.history.transactionDepth -= 1;

      // только когда транзакция полностью закончилась:
      if (state.history.transactionDepth === 0) {
        const initial = state.history.transactionInitial;
        state.history.transactionInitial = null;
        const finalSnap = makeSnapshot(state);

        // если изменения произошли — пушим initial snapshot в past (чтобы undo вернул к initial)
        if (
          initial &&
          JSON.stringify(initial.presentation) !== JSON.stringify(finalSnap.presentation)
        ) {
          state.history.past.push(initial);
          if (state.history.past.length > state.history.maxItems) {
            state.history.past.shift();
          }
          // очистим future после новой правки
          state.history.future = [];
        }
        state.history.transactionAction = null;
      }
    },

    // ----------------------
    // SELECTION (no history)
    // ----------------------
    selectSlide(state, action: PayloadAction<string>) {
      state.selectedSlideId = action.payload;
      state.selectedSlideIds = [action.payload];
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
      state.selectedElementIds = [action.payload];
    },

    selectMultipleElements(state, action: PayloadAction<string[]>) {
      state.selectedElementIds = action.payload;
    },

    addToSelection(state, action: PayloadAction<string>) {
      if (!state.selectedElementIds.includes(action.payload)) {
        state.selectedElementIds.push(action.payload);
      }
    },

    removeFromSelection(state, action: PayloadAction<string>) {
      state.selectedElementIds = state.selectedElementIds.filter((id) => id !== action.payload);
    },

    clearSelection(state) {
      state.selectedElementIds = [];
    },

    // ----------------------
    // PRESENTATION MUTATIONS (history-aware)
    // ----------------------
    loadDemoPresentation(state) {
      pushToPast(state, 'editor/loadDemoPresentation');
      state.presentation = clonePresentation(demoPresentation);
      state.selectedSlideId = demoPresentation.slides[0]?.id || '';
      state.selectedSlideIds = demoPresentation.slides[0] ? [demoPresentation.slides[0].id] : [];
      state.selectedElementIds = [];
    },

    updateSlide(state, action: PayloadAction<(s: Slide) => Slide>) {
      const slideId = state.selectedSlideId;
      const oldSlide = state.presentation.slides.find((s) => s.id === slideId);
      if (!oldSlide) return;

      // вычисляем новое состояние слайда (используем клон oldSlide для безопасного сравнения)
      const newSlide = action.payload(
        clonePresentation({ ...state.presentation }).slides.find((s) => s.id === slideId)!
      );

      // если не изменилось — не записываем историю
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

      // если в транзакции (например текст редактируется) — pushToPast вернёт false и не запишет промежуточные
      pushToPast(state, 'editor/updateTextContent');
      state.presentation.slides = state.presentation.slides.map((s) =>
        s.id === slideId ? func.changeText(s, elementId, content) : s
      );
    },

    addSlide(state, action: PayloadAction<Slide>) {
      pushToPast(state, 'editor/addSlide');
      state.presentation = func.addSlide(state.presentation, action.payload);
      state.selectedSlideId = action.payload.id;
      state.selectedSlideIds = [action.payload.id];
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
      // если порядок не изменился — не записываем
      if (JSON.stringify(state.presentation.slides) === JSON.stringify(action.payload)) return;

      // если в транзакции, pushToPast вернёт сразу (не будет добавлять) — это ожидаемо
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
      pushToPast(state, 'editor/changeBackground');
      state.presentation.slides = state.presentation.slides.map((s) =>
        s.id === slide.id ? func.changeBackground(s, action.payload) : s
      );
    },

    addImageWithUrl(state, action: PayloadAction<string>) {
      pushToPast(state, 'editor/addImageWithUrl');
      const slide = state.presentation.slides.find((s) => s.id === state.selectedSlideId);
      if (!slide) return;

      const imageElement = {
        ...temp.createImageElement(),
        src: action.payload,
        id: `image-${Date.now()}`,
      };

      state.presentation.slides = state.presentation.slides.map((s) =>
        s.id === slide.id ? func.addImage(s, imageElement) : s
      );
    },

    handleAction(state, action: PayloadAction<string>) {
      // В handleAction делаем pushToPast в конкретных случаях ниже (точечно)
      const act = action.payload;
      const slideId = state.selectedSlideId;
      const slide = state.presentation.slides.find((s) => s.id === slideId);
      const elId = state.selectedElementIds[0];

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

      if (slideMap[act]) {
        pushToPast(state, 'editor/handleAction');
        const newSlide = { ...slideMap[act], id: `slide${Date.now()}` };
        state.presentation = func.addSlide(state.presentation, newSlide);
        state.selectedSlideId = newSlide.id;
        state.selectedSlideIds = [newSlide.id];
        state.selectedElementIds = [];
        return;
      }

      // редкие одношаговые действия: делаем pushToPast перед их применением
      if (act.startsWith('TEXT_SIZE:')) {
        const size = parseInt(act.split(':')[1].trim(), 10);
        if (slide && elId) {
          pushToPast(state, 'editor/handleAction/TEXT_SIZE');
          state.presentation.slides = state.presentation.slides.map((s) =>
            s.id === slide.id ? func.changeTextSize(s, elId, size) : s
          );
        }
        return;
      }

      if (act.startsWith('TEXT_ALIGN_HORIZONTAL:')) {
        const align = act.split(':')[1].trim() as 'left' | 'center' | 'right' | 'justify';
        if (slide && elId) {
          pushToPast(state, 'editor/handleAction/TEXT_ALIGN_H');
          state.presentation.slides = state.presentation.slides.map((s) =>
            s.id === slide.id ? func.changeTextAlignment(s, elId, align) : s
          );
        }
        return;
      }

      if (act.startsWith('TEXT_ALIGN_VERTICAL:')) {
        const vAlign = act.split(':')[1].trim() as 'top' | 'middle' | 'bottom';
        if (slide && elId) {
          pushToPast(state, 'editor/handleAction/TEXT_ALIGN_V');
          state.presentation.slides = state.presentation.slides.map((s) =>
            s.id === slide.id ? func.changeTextVerticalAlignment(s, elId, vAlign) : s
          );
        }
        return;
      }

      if (act.startsWith('TEXT_LINE_HEIGHT:')) {
        const lineHeight = parseFloat(act.split(':')[1].trim());
        if (slide && elId) {
          pushToPast(state, 'editor/handleAction/TEXT_LINE_HEIGHT');
          state.presentation.slides = state.presentation.slides.map((s) =>
            s.id === slide.id ? func.changeTextLineHeight(s, elId, lineHeight) : s
          );
        }
        return;
      }

      if (act.startsWith('TEXT_COLOR:')) {
        const color = act.split(':')[1].trim();
        if (slide && elId) {
          pushToPast(state, 'editor/handleAction/TEXT_COLOR');
          state.presentation.slides = state.presentation.slides.map((s) =>
            s.id === slide.id ? func.changeTextColor(s, elId, color) : s
          );
        }
        return;
      }

      if (act.startsWith('SHAPE_FILL:')) {
        const color = act.split(':')[1].trim();
        if (slide && elId) {
          pushToPast(state, 'editor/handleAction/SHAPE_FILL');
          state.presentation.slides = state.presentation.slides.map((s) =>
            s.id === slide.id ? func.changeTextBackgroundColor(s, elId, color) : s
          );
        }
        return;
      }

      if (act.startsWith('SLIDE_BACKGROUND:')) {
        const color = act.split(': ')[1];
        if (slide) {
          pushToPast(state, 'editor/handleAction/SLIDE_BACKGROUND');
          state.presentation.slides = state.presentation.slides.map((s) =>
            s.id === slide.id ? func.changeBackground(s, { type: 'color', value: color }) : s
          );
        }
        return;
      }

      if (act === 'TEXT_BOLD' && slide && elId) {
        pushToPast(state, 'editor/handleAction/TEXT_BOLD');
        state.presentation.slides = state.presentation.slides.map((s) =>
          s.id === slide.id
            ? {
                ...s,
                elements: s.elements.map((el) =>
                  el.id === elId && el.type === 'text' ? { ...el, bold: !el.bold } : el
                ),
              }
            : s
        );
        return;
      }

      if (act === 'TEXT_ITALIC' && slide && elId) {
        pushToPast(state, 'editor/handleAction/TEXT_ITALIC');
        state.presentation.slides = state.presentation.slides.map((s) =>
          s.id === slide.id
            ? {
                ...s,
                elements: s.elements.map((el) =>
                  el.id === elId && el.type === 'text' ? { ...el, italic: !el.italic } : el
                ),
              }
            : s
        );
        return;
      }

      if (act === 'TEXT_UNDERLINE' && slide && elId) {
        pushToPast(state, 'editor/handleAction/TEXT_UNDERLINE');
        state.presentation.slides = state.presentation.slides.map((s) =>
          s.id === slide.id
            ? {
                ...s,
                elements: s.elements.map((el) =>
                  el.id === elId && el.type === 'text' ? { ...el, underline: !el.underline } : el
                ),
              }
            : s
        );
        return;
      }

      if (act === 'CHANGE_FONT_FAMILY' && slide && elId) {
        pushToPast(state, 'editor/handleAction/CHANGE_FONT_FAMILY');
        state.presentation.slides = state.presentation.slides.map((s) =>
          s.id === slide.id
            ? {
                ...s,
                elements: s.elements.map((el) =>
                  el.id === elId && el.type === 'text' ? { ...el, fontFamily: 'Arial' } : el
                ),
              }
            : s
        );
        return;
      }

      if (act === 'DELETE_SELECTED' && slide && elId) {
        pushToPast(state, 'editor/handleAction/DELETE_SELECTED');
        state.presentation.slides = state.presentation.slides.map((s) =>
          s.id === slide.id ? func.removeElement(s, elId) : s
        );
        state.selectedElementIds = state.selectedElementIds.filter((id) => id !== elId);
        return;
      }

      switch (act) {
        case 'REMOVE_SLIDE':
          if (slideId) {
            pushToPast(state, 'editor/REMOVE_SLIDE');
            state.presentation = func.removeSlide(state.presentation, slideId);
            state.selectedSlideId = state.presentation.slides[0]?.id || '';
            state.selectedSlideIds = state.presentation.slides[0]
              ? [state.presentation.slides[0].id]
              : [];
            state.selectedElementIds = [];
          }
          break;

        case 'ADD_TEXT':
          if (slide) {
            pushToPast(state, 'editor/ADD_TEXT');
            state.presentation.slides = state.presentation.slides.map((s) =>
              s.id === slide.id ? func.addText(s, temp.createTextElement()) : s
            );
          }
          break;

        case 'ADD_IMAGE':
          if (slide) {
            pushToPast(state, 'editor/ADD_IMAGE');
            state.presentation.slides = state.presentation.slides.map((s) =>
              s.id === slide.id ? func.addImage(s, temp.createImageElement()) : s
            );
          }
          break;

        case 'REMOVE_ELEMENT':
          if (slide && elId) {
            pushToPast(state, 'editor/REMOVE_ELEMENT');
            state.presentation.slides = state.presentation.slides.map((s) =>
              s.id === slide.id ? func.removeElement(s, elId) : s
            );
            state.selectedElementIds = state.selectedElementIds.filter((id) => id !== elId);
          }
          break;

        case 'DUPLICATE_SLIDE':
          if (slide) {
            pushToPast(state, 'editor/DUPLICATE_SLIDE');
            const duplicatedSlide = {
              ...slide,
              id: `slide-${Date.now()}`,
              elements: slide.elements.map((el) => ({ ...el, id: `${el.id}-copy-${Date.now()}` })),
            };
            state.presentation = func.addSlide(state.presentation, duplicatedSlide);
            state.selectedSlideId = duplicatedSlide.id;
            state.selectedSlideIds = [duplicatedSlide.id];
            state.selectedElementIds = [];
          }
          break;
      }
    },

    // ----------------------
    // UNDO / REDO
    // ----------------------
    undo(state) {
      const past = state.history.past;
      if (past.length === 0) return;
      const last = past.pop()!;
      const currentSnap = makeSnapshot(state);
      state.history.future.push(currentSnap);

      state.presentation = clonePresentation(last.presentation);
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
} = editorSlice.actions;

export default editorSlice.reducer;
