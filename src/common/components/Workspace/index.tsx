import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../store';
import { selectElement, selectMultipleElements, clearSelection } from '../../../store/editorSlice';
import { Slide, SlideElement } from '../../../store/types/presentation';
import './styles.css';

import TextElementView from './parts/TextElement';
import ImageElementView from './parts/ImageElement';

interface Props {
  preview?: boolean;
}

export default function Workspace({ preview }: Props) {
  const dispatch = useDispatch();
  const presentation = useSelector((state: RootState) => state.editor.presentation);
  const selectedSlideId = useSelector((state: RootState) => state.editor.selectedSlideId);
  const selectedElementIds = useSelector((state: RootState) => state.editor.selectedElementIds);

  const slide = presentation.slides.find((s: Slide) => s.id === selectedSlideId);

  // Функция для получения всех элементов текущего слайда
  const getAllElements = (): SlideElement[] => {
    return slide?.elements || [];
  };

  const handleWorkspaceClick = (e: React.MouseEvent) => {
    if (!preview && !e.ctrlKey && !e.metaKey) {
      dispatch(clearSelection());
    }
  };

  const handleElementClick = (e: React.MouseEvent, elementId: string) => {
    e.stopPropagation();

    if (e.ctrlKey || e.metaKey) {
      // Ctrl+click - добавляем/убираем из выделения
      if (selectedElementIds.includes(elementId)) {
        dispatch(
          selectMultipleElements(selectedElementIds.filter((id: string) => id !== elementId))
        );
      } else {
        dispatch(selectMultipleElements([...selectedElementIds, elementId]));
      }
    } else {
      // Обычный клик - выделяем один элемент
      dispatch(selectElement(elementId));
    }
  };

  return (
    <div className="workspace-panel">
      <div className="workspace">
        {slide ? (
          <div
            className="workspace-content"
            style={{
              backgroundColor: slide.background.type === 'color' ? slide.background.value : 'white',
              position: 'relative',
              overflow: 'hidden',
            }}
            onClick={handleWorkspaceClick}
          >
            {slide.elements.map((el) => {
              if (el.type === 'text') {
                return (
                  <TextElementView
                    key={el.id}
                    elementId={el.id}
                    preview={!!preview}
                    selectedElementIds={selectedElementIds}
                    onElementClick={handleElementClick}
                    getAllElements={getAllElements}
                  />
                );
              }

              if (el.type === 'image') {
                return (
                  <ImageElementView
                    key={el.id}
                    elementId={el.id}
                    preview={!!preview}
                    selectedElementIds={selectedElementIds}
                    onElementClick={handleElementClick}
                    getAllElements={getAllElements}
                  />
                );
              }

              return null;
            })}
          </div>
        ) : (
          <p>Выберите слайд</p>
        )}
      </div>
    </div>
  );
}
