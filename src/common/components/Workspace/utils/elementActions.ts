// C:\PGTU\FRONT-end\presentation maker\src\common\utils\elementActions.ts
import { clipboardService } from './clipboardService';
import { AppDispatch } from '../../../../store';
import { duplicateElements, handleAction, removeSlide } from '../../../../store/editorSlice';

export class ElementActions {
  // ВЫРЕЗАТЬ (Ctrl+X)
  static cut(selectedElementIds: string[], dispatch: AppDispatch) {
    if (selectedElementIds.length === 0) return;

    clipboardService.cut(selectedElementIds);
    dispatch(handleAction('DELETE_SELECTED'));
  }

  // КОПИРОВАТЬ (Ctrl+C)
  static copy(selectedElementIds: string[]) {
    if (selectedElementIds.length === 0) return;

    clipboardService.copy(selectedElementIds);
  }

  // ВСТАВИТЬ (Ctrl+V)
  static paste(selectedElementIds: string[], dispatch: AppDispatch) {
    const elementIds = clipboardService.paste();

    if (elementIds.length > 0) {
      dispatch(duplicateElements({ elementIds }));
    } else if (selectedElementIds.length > 0) {
      dispatch(duplicateElements({ elementIds: selectedElementIds }));
    }
  }

  // ДУБЛИРОВАТЬ (Ctrl+D и кнопка в меню)
  static duplicate(selectedElementIds: string[], dispatch: AppDispatch) {
    if (selectedElementIds.length === 0) return;

    dispatch(duplicateElements({ elementIds: selectedElementIds }));
  }

  // УДАЛИТЬ ЭЛЕМЕНТЫ (Delete)
  static deleteElements(selectedElementIds: string[], dispatch: AppDispatch) {
    if (selectedElementIds.length === 0) return;

    dispatch(handleAction('DELETE_SELECTED'));
  }

  // УДАЛИТЬ СЛАЙДЫ (Ctrl+Delete)
  static deleteSlides(selectedSlideIds: string[], dispatch: AppDispatch) {
    if (selectedSlideIds.length === 0) return;

    selectedSlideIds.forEach((slideId: string) => {
      dispatch(removeSlide(slideId));
    });
  }
}
