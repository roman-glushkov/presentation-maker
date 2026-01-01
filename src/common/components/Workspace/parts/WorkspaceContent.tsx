import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../store';
import {
  selectElement,
  selectMultipleElements,
  clearSelection,
} from '../../../../store/editorSlice';
import { Slide } from '../../../../store/types/presentation';
import TextElementView from './TextElement';
import ImageElementView from './ImageElement';
import ShapeElementView from './ShapeElement'; // ← ДОБАВЬТЕ ИМПОРТ

interface WorkspaceContentProps {
  slide: Slide;
  preview?: boolean;
}

export default function WorkspaceContent({ slide, preview }: WorkspaceContentProps) {
  const dispatch = useDispatch();
  const selectedElementIds = useSelector((state: RootState) => state.editor.selectedElementIds);

  const handleWorkspaceClick = (e: React.MouseEvent) => {
    if (!preview && !e.ctrlKey && !e.metaKey) {
      dispatch(clearSelection());
    }
  };

  const handleElementClick = (e: React.MouseEvent, elementId: string) => {
    e.stopPropagation();

    if (e.ctrlKey || e.metaKey) {
      if (selectedElementIds.includes(elementId)) {
        dispatch(
          selectMultipleElements(selectedElementIds.filter((id: string) => id !== elementId))
        );
      } else {
        dispatch(selectMultipleElements([...selectedElementIds, elementId]));
      }
    } else {
      dispatch(selectElement(elementId));
    }
  };

  const getAllElements = () => slide?.elements || [];

  return (
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

        // ДОБАВЬТЕ ЭТОТ КОД ДЛЯ ФИГУР
        if (el.type === 'shape') {
          return (
            <ShapeElementView
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
  );
}
