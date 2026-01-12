import { EditorState } from '../editorSlice';
import {
  TEXT_SHADOW_OPTIONS,
  LIST_OPTIONS,
} from '../../common/components/Toolbar/constants/textOptions';
import * as func from '../functions/presentation';
import { Slide } from '../types/presentation';

export function handleTextAction(state: EditorState, action: string, elId: string) {
  const slideId = state.selectedSlideId;
  const slide = state.presentation.slides.find((s: Slide) => s.id === slideId);
  if (!slide || !elId) return false;

  if (action.startsWith('LIST_TYPE:')) {
    const listKey = action.split(':')[1].trim();
    const listOption = LIST_OPTIONS.find((opt) => opt.key === listKey);
    if (!listOption || !listOption.prefix) return true;

    const element = slide.elements.find((el) => el.id === elId);
    if (!element || element.type !== 'text') return true;

    const lines = element.content.split('\n');
    const newLines = lines.map((line) => {
      if (!line.trim()) return line;

      const existing = LIST_OPTIONS.find((opt) => opt.prefix && line.startsWith(opt.prefix));
      let clean = existing?.prefix ? line.slice(existing.prefix.length) : line;

      return listOption.prefix + clean;
    });

    state.presentation.slides = state.presentation.slides.map((s: Slide) =>
      s.id === slideId
        ? {
            ...s,
            elements: s.elements.map((el) =>
              el.id === elId && el.type === 'text'
                ? { ...el, content: newLines.join('\n'), listType: listKey }
                : el
            ),
          }
        : s
    );

    return true;
  }

  if (action.startsWith('TEXT_SHADOW:')) {
    const shadowKey = action.split(':')[1].trim();
    const shadowPreset = TEXT_SHADOW_OPTIONS.find(
      (option: { key: string }) => option.key === shadowKey
    );

    if (shadowPreset) {
      state.presentation.slides = state.presentation.slides.map((s: Slide) =>
        s.id === slide.id
          ? {
              ...s,
              elements: s.elements.map((el) =>
                el.id === elId
                  ? {
                      ...el,
                      shadow:
                        shadowKey === 'none'
                          ? undefined
                          : {
                              color: shadowPreset.color,
                              blur: shadowPreset.blur,
                            },
                    }
                  : el
              ),
            }
          : s
      );
    }
    return true;
  }

  if (action.startsWith('TEXT_FONT:')) {
    const fontFamily = action.split(':')[1].trim();
    state.presentation.slides = state.presentation.slides.map((s: Slide) =>
      s.id === slide.id ? func.changeTextFont(s, elId, fontFamily) : s
    );
    return true;
  }

  if (action.startsWith('TEXT_SIZE:')) {
    const size = parseInt(action.split(':')[1].trim(), 10);
    state.presentation.slides = state.presentation.slides.map((s: Slide) =>
      s.id === slide.id ? func.changeTextSize(s, elId, size) : s
    );
    return true;
  }

  if (action.startsWith('TEXT_ALIGN_HORIZONTAL:')) {
    const align = action.split(':')[1].trim() as 'left' | 'center' | 'right' | 'justify';
    state.presentation.slides = state.presentation.slides.map((s: Slide) =>
      s.id === slide.id ? func.changeTextAlignment(s, elId, align) : s
    );
    return true;
  }

  if (action.startsWith('TEXT_ALIGN_VERTICAL:')) {
    const vAlign = action.split(':')[1].trim() as 'top' | 'middle' | 'bottom';
    state.presentation.slides = state.presentation.slides.map((s: Slide) =>
      s.id === slide.id ? func.changeTextVerticalAlignment(s, elId, vAlign) : s
    );
    return true;
  }

  if (action.startsWith('TEXT_LINE_HEIGHT:')) {
    const lineHeight = parseFloat(action.split(':')[1].trim());
    state.presentation.slides = state.presentation.slides.map((s: Slide) =>
      s.id === slide.id ? func.changeTextLineHeight(s, elId, lineHeight) : s
    );
    return true;
  }

  if (action.startsWith('TEXT_COLOR:')) {
    const color = action.split(':')[1].trim();
    state.presentation.slides = state.presentation.slides.map((s: Slide) =>
      s.id === slide.id ? func.changeTextColor(s, elId, color) : s
    );
    return true;
  }

  if (action === 'TEXT_BOLD') {
    state.presentation.slides = state.presentation.slides.map((s: Slide) =>
      s.id === slide.id
        ? {
            ...s,
            elements: s.elements.map((el) =>
              el.id === elId && el.type === 'text' ? { ...el, bold: !el.bold } : el
            ),
          }
        : s
    );
    return true;
  }

  if (action === 'TEXT_ITALIC') {
    state.presentation.slides = state.presentation.slides.map((s: Slide) =>
      s.id === slide.id
        ? {
            ...s,
            elements: s.elements.map((el) =>
              el.id === elId && el.type === 'text' ? { ...el, italic: !el.italic } : el
            ),
          }
        : s
    );
    return true;
  }

  if (action === 'TEXT_UNDERLINE') {
    state.presentation.slides = state.presentation.slides.map((s: Slide) =>
      s.id === slide.id
        ? {
            ...s,
            elements: s.elements.map((el) =>
              el.id === elId && el.type === 'text' ? { ...el, underline: !el.underline } : el
            ),
          }
        : s
    );
    return true;
  }

  if (action === 'CHANGE_FONT_FAMILY') {
    state.presentation.slides = state.presentation.slides.map((s: Slide) =>
      s.id === slide.id
        ? {
            ...s,
            elements: s.elements.map((el) =>
              el.id === elId && el.type === 'text' ? { ...el, fontFamily: 'Arial' } : el
            ),
          }
        : s
    );
    return true;
  }

  return false;
}
