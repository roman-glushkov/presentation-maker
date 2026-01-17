import { SlideElement } from '../../../../store/types/presentation';
import { SelectionType, ButtonAvailability, availabilityConfig } from '../constants/availability';

export function getSelectionType(selectedElements: SlideElement[]): SelectionType {
  if (selectedElements.length === 0) {
    return 'none';
  }

  if (selectedElements.length === 1) {
    const element = selectedElements[0];
    switch (element.type) {
      case 'text':
        return 'text';
      case 'image':
        return 'image';
      case 'shape':
        return 'shape';
      default:
        return 'other';
    }
  }

  return 'multiple';
}

export function isButtonAvailable(selectionType: SelectionType, action: string): boolean {
  const config = availabilityConfig[selectionType];
  const buttonConfig = config.find((item) => item.action === action);

  if (buttonConfig) {
    return buttonConfig.available;
  }

  return true;
}

export function getButtonDisabledReason(
  selectionType: SelectionType,
  action: string
): string | undefined {
  const config = availabilityConfig[selectionType];
  const buttonConfig = config.find((item: ButtonAvailability) => item.action === action);
  return buttonConfig?.reason;
}
