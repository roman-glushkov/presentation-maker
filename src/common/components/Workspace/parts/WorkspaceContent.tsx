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

const elementComponents = {
  text: TextElementView,
  image: ImageElementView,
  shape: ShapeElementView,
} as const;

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
      const newSelection = selectedElementIds.includes(elementId)
        ? selectedElementIds.filter((id) => id !== elementId)
        : [...selectedElementIds, elementId];
      dispatch(selectMultipleElements(newSelection));
    } else {
      dispatch(selectElement(elementId));
    }
  };

  const backgroundStyle: React.CSSProperties = (() => {
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
        return { backgroundColor: bg.value };
      default:
        return { backgroundColor: '#fff' };
    }
  })();

  const ElementComponent = (el: Slide['elements'][0]) => {
    const Component = elementComponents[el.type];
    if (!Component) return null;

    return (
      <Component
        key={el.id}
        elementId={el.id}
        preview={!!preview}
        selectedElementIds={selectedElementIds}
        onElementClick={handleElementClick}
        getAllElements={() => slide?.elements || []}
      />
    );
  };

  return (
    <div className="workspace-content" style={backgroundStyle} onClick={handleWorkspaceClick}>
      {slide.elements.map(ElementComponent)}
    </div>
  );
}
