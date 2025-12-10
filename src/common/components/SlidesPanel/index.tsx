import React from 'react';
import SlidesContainer from './parts/Container';
import useSlidesKeyboard from './hooks/useSlidesKeyboard';
import useSlidesCopyPaste from './hooks/useSlidesCopyPaste'; // Добавлено
import './styles.css';

export default function SlidesPanel() {
  useSlidesKeyboard(); // Хук удаления слайдов
  useSlidesCopyPaste(); // Хук копирования-вставки слайдов

  return (
    <div className="slides-panel">
      <h3>Слайды</h3>
      <SlidesContainer />
    </div>
  );
}
