// src/common/shared/hooks/domUtils.ts
export const isTextInputFocused = (): boolean => {
  const activeElement = document.activeElement;
  return !!(
    activeElement?.tagName === 'INPUT' ||
    activeElement?.tagName === 'TEXTAREA' ||
    activeElement?.hasAttribute('contenteditable')
  );
};

export const isEditingTextElement = (): boolean => {
  const activeElement = document.activeElement;
  if (!activeElement) return false;

  if (activeElement.tagName === 'TEXTAREA' || activeElement.hasAttribute('contenteditable')) {
    return true;
  }

  const closestTextElement = activeElement.closest('.text-edit-area, [data-text-editing="true"]');
  return !!closestTextElement;
};
