import { clipboardService } from './clipboardService';
import { AppDispatch } from '../../../../store';
import { duplicateElements, handleAction, removeSlide } from '../../../../store/editorSlice';

export class ElementActions {
  static cut(selectedElementIds: string[], dispatch: AppDispatch) {
    if (selectedElementIds.length === 0) return;

    clipboardService.cut(selectedElementIds);
    dispatch(handleAction('DELETE_SELECTED'));
  }

  static copy(selectedElementIds: string[]) {
    if (selectedElementIds.length === 0) return;

    clipboardService.copy(selectedElementIds);
  }

  static paste(selectedElementIds: string[], dispatch: AppDispatch) {
    const elementIds = clipboardService.paste();

    if (elementIds.length > 0) {
      dispatch(duplicateElements({ elementIds }));
    } else if (selectedElementIds.length > 0) {
      dispatch(duplicateElements({ elementIds: selectedElementIds }));
    }
  }

  static duplicate(selectedElementIds: string[], dispatch: AppDispatch) {
    if (selectedElementIds.length === 0) return;

    dispatch(duplicateElements({ elementIds: selectedElementIds }));
  }

  static deleteElements(selectedElementIds: string[], dispatch: AppDispatch) {
    if (selectedElementIds.length === 0) return;

    dispatch(handleAction('DELETE_SELECTED'));
  }

  static deleteSlides(selectedSlideIds: string[], dispatch: AppDispatch) {
    if (selectedSlideIds.length === 0) return;

    selectedSlideIds.forEach((slideId: string) => {
      dispatch(removeSlide(slideId));
    });
  }

  static bringToFront(selectedElementIds: string[], dispatch: AppDispatch) {
    if (selectedElementIds.length === 0) return;

    dispatch(handleAction('BRING_TO_FRONT'));
  }

  static sendToBack(selectedElementIds: string[], dispatch: AppDispatch) {
    if (selectedElementIds.length === 0) return;

    dispatch(handleAction('SEND_TO_BACK'));
  }
}
