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
import ShapeElementView from './ShapeElement';

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

  // Определяем стили фона
  const getBackgroundStyle = (): React.CSSProperties => {
    const bg = slide.background;

    switch (bg.type) {
      case 'image':
        return {
          backgroundImage: `url(${bg.value})`,
          backgroundSize: bg.size || 'cover',
          backgroundPosition: bg.position || 'center',
          backgroundRepeat: 'no-repeat',
        };
      case 'color':
        return {
          backgroundColor: bg.value,
        };
      case 'none':
      default:
        return {
          backgroundColor: '#fff',
        };
    }
  };

  return (
    <div
      className="workspace-content"
      style={getBackgroundStyle()} // УБРАЛИ width и height
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
