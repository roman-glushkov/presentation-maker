import { EditorState } from '../editorSlice';
import { ShapeType, Slide } from '../types/presentation';
import { SHAPE_SMOOTHING_OPTIONS } from '../../common/components/Toolbar/constants/textOptions';
import * as func from '../functions/presentation';
import * as temp from '../templates/presentation';

export function handleShapeAction(state: EditorState, action: string, elId: string) {
  const slideId = state.selectedSlideId;
  const slide = state.presentation.slides.find((s: Slide) => s.id === slideId);
  if (!slide) return false;

  if (action.startsWith('SHAPE_SMOOTHING:')) {
    const smoothingKey = action.split(':')[1].trim();
    const smoothingPreset = SHAPE_SMOOTHING_OPTIONS.find((option) => option.key === smoothingKey);

    if (smoothingPreset) {
      state.presentation.slides = state.presentation.slides.map((s: Slide) =>
        s.id === slide.id
          ? {
              ...s,
              elements: s.elements.map((el) =>
                el.id === elId
                  ? {
                      ...el,
                      smoothing:
                        typeof smoothingPreset.value === 'string'
                          ? parseInt(smoothingPreset.value, 10)
                          : smoothingPreset.value,
                    }
                  : el
              ),
            }
          : s
      );
    }
    return true;
  }

  if (action.startsWith('ADD_SHAPE:')) {
    const shapeType = action.split(':')[1].trim() as ShapeType;
    const shapeElement = temp.createShapeElement(shapeType);
    state.presentation.slides = state.presentation.slides.map((s: Slide) =>
      s.id === slide.id ? func.addShape(s, shapeElement) : s
    );
    return true;
  }

  if (action.startsWith('SHAPE_FILL:')) {
    const color = action.split(':')[1].trim();
    const element = slide.elements.find((el) => el.id === elId);

    if (element?.type === 'shape') {
      state.presentation.slides = state.presentation.slides.map((s: Slide) =>
        s.id === slide.id ? func.changeShapeFill(s, elId, color) : s
      );
    } else if (element?.type === 'text') {
      state.presentation.slides = state.presentation.slides.map((s: Slide) =>
        s.id === slide.id ? func.changeTextBackgroundColor(s, elId, color) : s
      );
    }
    return true;
  }

  if (action.startsWith('SHAPE_STROKE:')) {
    const color = action.split(':')[1].trim();
    state.presentation.slides = state.presentation.slides.map((s: Slide) =>
      s.id === slide.id ? func.changeShapeStroke(s, elId, color) : s
    );
    return true;
  }

  if (action.startsWith('SHAPE_STROKE_WIDTH:')) {
    const width = parseInt(action.split(':')[1].trim(), 10);
    state.presentation.slides = state.presentation.slides.map((s: Slide) =>
      s.id === slide.id ? func.changeShapeStrokeWidth(s, elId, width) : s
    );
    return true;
  }

  return false;
}
