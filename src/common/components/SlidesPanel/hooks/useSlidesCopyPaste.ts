// SlidesPanel/hooks/useSlidesCopyPaste.ts
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../store';
import { duplicateSlide } from '../../../../store/editorSlice';

export default function useSlidesCopyPaste() {
  const dispatch = useDispatch();
  const selectedSlideIds = useSelector((state: RootState) => state.editor.selectedSlideIds);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Проверяем, не редактируется ли текст
      const isTextInputFocused =
        document.activeElement?.tagName === 'INPUT' ||
        document.activeElement?.tagName === 'TEXTAREA' ||
        document.activeElement?.hasAttribute('contenteditable');

      if (isTextInputFocused) return;

      const isCtrl = e.ctrlKey || e.metaKey;
      if (!isCtrl || selectedSlideIds.length === 0) return;

      // Ctrl+C - сохраняем ID слайдов в sessionStorage (простейший буфер)
      if (e.code === 'KeyC') {
        // Используем code, а не key
        e.preventDefault();
        e.stopPropagation();

        // Сохраняем ID выбранных слайдов в sessionStorage
        sessionStorage.setItem('slidesClipboard', JSON.stringify(selectedSlideIds));
        console.log('Слайды скопированы:', selectedSlideIds);
      }

      // Ctrl+V - дублируем слайд (берем последний выбранный)
      if (e.code === 'KeyV') {
        // Используем code, а не key
        e.preventDefault();
        e.stopPropagation();

        // Берем ID слайда из буфера или последний выбранный
        const clipboardData = sessionStorage.getItem('slidesClipboard');
        let slideIdToDuplicate;

        if (clipboardData) {
          const slideIds = JSON.parse(clipboardData);
          // Дублируем последний слайд из буфера
          slideIdToDuplicate = slideIds[slideIds.length - 1];
        } else {
          // Если буфер пустой, дублируем последний выбранный слайд
          slideIdToDuplicate = selectedSlideIds[selectedSlideIds.length - 1];
        }

        if (slideIdToDuplicate) {
          dispatch(duplicateSlide(slideIdToDuplicate));
        }
      }

      // Ctrl+D - дублирование (оставляем для совместимости)
      if (e.code === 'KeyD') {
        e.preventDefault();
        e.stopPropagation();

        // Дублируем последний выбранный слайд
        const lastSelectedId = selectedSlideIds[selectedSlideIds.length - 1];
        if (lastSelectedId) {
          dispatch(duplicateSlide(lastSelectedId));
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown, { capture: true });
    return () => window.removeEventListener('keydown', handleKeyDown, { capture: true });
  }, [dispatch, selectedSlideIds]);
}
