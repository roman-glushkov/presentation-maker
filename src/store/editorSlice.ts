import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Presentation, Slide, Background, SlideElement, ShapeType } from './types/presentation';

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

function clonePresentation(p: Presentation): Presentation {
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

      console.log('slideTitle существует?', !!sld.slideTitle);
      console.log('slideTitle структура:', sld.slideTitle);

      const titleSlide = {
        ...sld.slideTitle,
        id: newSlideId,
      };

      titleSlide.elements =
        titleSlide.elements?.map((el) => ({
          ...el,
          id: `${el.type}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        })) || [];

      console.log('Созданный слайд:', titleSlide);

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
          id: `${el.id}-copy-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        })),
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
      const slideId = state.selectedSlideId;
      const slide = state.presentation.slides.find((s) => s.id === slideId);
      const elId = state.selectedElementIds[0];
      const currentSelectedElementIds = [...state.selectedElementIds]; // ← ДОБАВЬТЕ ЭТУ СТРОКУ

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

      // ДОБАВЛЯЕМ ОБРАБОТКУ ПЕРЕДНЕГО/ЗАДНЕГО ПЛАНА
      if (act === 'BRING_TO_FRONT' && slide && currentSelectedElementIds.length > 0) {
        pushToPast(state, 'editor/handleAction/BRING_TO_FRONT');

        // Получаем элементы слайда
        const elements = [...slide.elements];

        // Фильтруем выбранные элементы
        const selectedElements = elements.filter((el) => currentSelectedElementIds.includes(el.id));

        // Фильтруем невыбранные элементы
        const otherElements = elements.filter((el) => !currentSelectedElementIds.includes(el.id));

        // Помещаем выбранные элементы в конец (на передний план)
        const newElements = [...otherElements, ...selectedElements];

        state.presentation.slides = state.presentation.slides.map((s) =>
          s.id === slide.id ? { ...s, elements: newElements } : s
        );
        return;
      }

      if (act === 'SEND_TO_BACK' && slide && currentSelectedElementIds.length > 0) {
        pushToPast(state, 'editor/handleAction/SEND_TO_BACK');

        // Получаем элементы слайда
        const elements = [...slide.elements];

        // Фильтруем выбранные элементы
        const selectedElements = elements.filter((el) => currentSelectedElementIds.includes(el.id));

        // Фильтруем невыбранные элементы
        const otherElements = elements.filter((el) => !currentSelectedElementIds.includes(el.id));

        // Помещаем выбранные элементы в начало (на задний план)
        const newElements = [...selectedElements, ...otherElements];

        state.presentation.slides = state.presentation.slides.map((s) =>
          s.id === slide.id ? { ...s, elements: newElements } : s
        );
        return;
      }

      if (slideMap[act]) {
        pushToPast(state, 'editor/handleAction');
        const newSlide = { ...slideMap[act], id: `slide${Date.now()}` };
        state.presentation = func.addSlide(state.presentation, newSlide);
        state.selectedSlideId = newSlide.id;
        state.selectedSlideIds = [newSlide.id];
        state.selectedElementIds = [];
        return;
      }

      if (act.startsWith('TEXT_FONT:')) {
        const fontFamily = act.split(':')[1].trim();
        if (slide && elId) {
          pushToPast(state, 'editor/handleAction/TEXT_FONT');
          state.presentation.slides = state.presentation.slides.map((s) =>
            s.id === slide.id ? func.changeTextFont(s, elId, fontFamily) : s
          );
        }
        return;
      }

      if (act.startsWith('ADD_SHAPE:')) {
        const shapeType = act.split(':')[1].trim() as ShapeType;
        console.log('Добавление фигуры:', shapeType); // ← ДОБАВЬТЕ
        console.log('Текущий слайд:', slide?.id); // ← ДОБАВЬТЕ

        if (slide) {
          pushToPast(state, 'editor/handleAction/ADD_SHAPE');
          // Используем через temp
          const shapeElement = temp.createShapeElement(shapeType);
          console.log('Созданная фигура:', shapeElement); // ← ДОБАВЬТЕ

          state.presentation.slides = state.presentation.slides.map((s) =>
            s.id === slide.id ? func.addShape(s, shapeElement) : s
          );

          console.log(
            'Фигура добавлена, элементы слайда:',
            state.presentation.slides.find((s) => s.id === slide.id)?.elements
          ); // ← ДОБАВЬТЕ
        }
        return;
      }

      if (act.startsWith('SHAPE_FILL:')) {
        const color = act.split(':')[1].trim();
        if (slide && elId) {
          pushToPast(state, 'editor/handleAction/SHAPE_FILL');
          // Проверяем тип элемента
          const element = slide.elements.find((el) => el.id === elId);
          if (element?.type === 'shape') {
            // Для фигур используем новую функцию
            state.presentation.slides = state.presentation.slides.map((s) =>
              s.id === slide.id ? func.changeShapeFill(s, elId, color) : s
            );
          } else if (element?.type === 'text') {
            // Для текста используем существующую
            state.presentation.slides = state.presentation.slides.map((s) =>
              s.id === slide.id ? func.changeTextBackgroundColor(s, elId, color) : s
            );
          }
        }
        return;
      }

      if (act.startsWith('SHAPE_STROKE:')) {
        const color = act.split(':')[1].trim();
        if (slide && elId) {
          pushToPast(state, 'editor/handleAction/SHAPE_STROKE');
          state.presentation.slides = state.presentation.slides.map((s) =>
            s.id === slide.id ? func.changeShapeStroke(s, elId, color) : s
          );
        }
        return;
      }

      if (act.startsWith('SHAPE_STROKE_WIDTH:')) {
        const width = parseInt(act.split(':')[1].trim(), 10);
        if (slide && elId) {
          pushToPast(state, 'editor/handleAction/SHAPE_STROKE_WIDTH');
          state.presentation.slides = state.presentation.slides.map((s) =>
            s.id === slide.id ? func.changeShapeStrokeWidth(s, elId, width) : s
          );
        }
        return;
      }

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

      if (act === 'DELETE_SELECTED' && slide && state.selectedElementIds.length > 0) {
        pushToPast(state, 'editor/handleAction/DELETE_SELECTED');

        state.presentation.slides = state.presentation.slides.map((s) =>
          s.id === slide.id
            ? {
                ...s,
                elements: s.elements.filter((el) => !state.selectedElementIds.includes(el.id)),
              }
            : s
        );

        state.selectedElementIds = [];
        return;
      }

      switch (act) {
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
