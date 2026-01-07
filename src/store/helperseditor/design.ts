import { EditorState } from '../editorSlice';
import { DESIGN_THEMES } from '../../common/components/Toolbar/constants/designThemes';
import { Slide } from '../types/presentation';

export function handleDesignAction(state: EditorState, action: string) {
  if (action.startsWith('DESIGN_THEME:')) {
    const themeId = action.split(':')[1];
    const theme = DESIGN_THEMES[themeId];
    if (!theme) return true;

    state.presentation.slides = state.presentation.slides.map((slide: Slide) => {
      if (themeId === 'no_design') {
        return {
          ...slide,
          background: {
            type: 'color',
            value: '#ffffff',
            isLocked: false,
          },
        };
      } else if (theme.backgroundImage) {
        return {
          ...slide,
          background: {
            type: 'image',
            value: theme.backgroundImage,
            size: theme.backgroundSize || 'cover',
            position: theme.backgroundPosition || 'center',
            isLocked: theme.isLocked,
          },
        };
      } else if (theme.backgroundColor) {
        return {
          ...slide,
          background: {
            type: 'color',
            value: theme.backgroundColor,
            isLocked: theme.isLocked,
          },
        };
      } else {
        return {
          ...slide,
          background: {
            type: 'color',
            value: '#ffffff',
            isLocked: false,
          },
        };
      }
    });
    return true;
  }

  return false;
}
