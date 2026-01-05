import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../store';
import { updateTextContent, updateSlide } from '../../../../store/editorSlice';
import { TextElement as TextElementType, SlideElement } from '../../../../store/types/presentation';
import ResizeHandle from './ResizeHandle';
import useDrag from '../hooks/useDrag';
import useResize from '../hooks/useResize';

interface Props {
  elementId: string;
  preview: boolean;
  selectedElementIds: string[];
  onElementClick: (e: React.MouseEvent, elementId: string) => void;
  getAllElements: () => SlideElement[];
}

export default function TextElementView({
  elementId,
  preview,
  selectedElementIds,
  onElementClick,
  getAllElements,
}: Props) {
  const dispatch = useDispatch();

  const element = useSelector((state: RootState) => {
    const slide = state.editor.presentation.slides.find((s) =>
      s.elements.some((el) => el.id === elementId)
    );
    return slide?.elements.find((el) => el.id === elementId) as TextElementType | undefined;
  });

  const isSelected = selectedElementIds.includes(elementId);

  const [isEditing, setIsEditing] = useState(false);
  const [localContent, setLocalContent] = useState(element?.content || '');

  const startDrag = useDrag({
    preview,
    setSelElId: () => {},
    bringToFront: () => {},
    updateSlide: (updater) => dispatch(updateSlide(updater)),
  });

  const startResize = useResize({
    preview,
    updateSlide: (updater) => dispatch(updateSlide(updater)),
  });

  useEffect(() => {
    if (element) {
      setLocalContent(element.content);
    }
  }, [element]);

  if (!element || element.type !== 'text') return null;

  const showPlaceholder = !element.content && element.placeholder && !isEditing;

  const textShadowStyle = element.shadow
    ? `0 2px ${element.shadow.blur}px ${element.shadow.color}`
    : 'none';

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!preview) {
      setIsEditing(true);
    }
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    startDrag(e, element, selectedElementIds, getAllElements);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      (e.currentTarget as HTMLTextAreaElement).blur();
    }
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      (e.currentTarget as HTMLTextAreaElement).blur();
    }
  };

  const textStyle: React.CSSProperties = {
    fontFamily: element.font,
    fontSize: `${element.fontSize}px`,
    lineHeight: element.lineHeight || 1.2,
    fontWeight: element.bold ? 'bold' : 'normal',
    fontStyle: showPlaceholder ? 'italic' : element.italic ? 'italic' : 'normal',
    textDecoration: element.underline ? 'underline' : 'none',
    textAlign: element.align || 'left',
    color: showPlaceholder ? '#999' : element.color || '#1f2937',
    whiteSpace: 'pre-wrap',
    textShadow: textShadowStyle,
  };

  return (
    <div
      className={`element ${isSelected ? 'selected' : ''}`}
      onClick={(e) => onElementClick(e, elementId)}
      onDoubleClick={handleDoubleClick}
      onPointerDown={handlePointerDown}
      style={{
        position: 'absolute',
        left: element.position.x,
        top: element.position.y,
        width: element.size.width,
        height: element.size.height,
        backgroundColor: element.backgroundColor || 'transparent',
        display: 'flex',
        flexDirection: 'column',
        justifyContent:
          element.verticalAlign === 'top'
            ? 'flex-start'
            : element.verticalAlign === 'middle'
              ? 'center'
              : 'flex-end',
        cursor: preview ? 'default' : 'grab',
        userSelect: 'none',
        padding: 4,
        boxSizing: 'border-box',
        border: isSelected && !preview ? '2px solid #3b82f6' : '1px solid #d1d5db',
        borderRadius: element.smoothing ? `${element.smoothing}px` : '0',
        overflow: 'visible',
      }}
    >
      {/* Основной текст */}
      {!preview && isEditing ? (
        <textarea
          autoFocus
          value={localContent}
          placeholder={element.placeholder}
          onChange={(e) => {
            const value = e.target.value;
            setLocalContent(value);
            dispatch(updateTextContent({ elementId, content: value }));
          }}
          onKeyDown={handleKeyDown}
          onBlur={() => setIsEditing(false)}
          style={{
            ...textStyle,
            width: '100%',
            height: '100%',
            background: 'transparent',
            border: 'none',
            outline: 'none',
            resize: 'none',
            padding: 0,
            margin: 0,
          }}
        />
      ) : (
        <div style={textStyle}>{showPlaceholder ? element.placeholder : element.content}</div>
      )}

      {/* Отражение текста */}
      {element.reflection && element.reflection > 0 && !isEditing && (
        <div
          style={{
            ...textStyle,
            transform: 'scaleY(-1)',
            opacity: element.reflection,
            marginTop: 4,
            maskImage: 'linear-gradient(to bottom, rgba(0,0,0,0.6), transparent)',
            WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,0.6), transparent)',
            pointerEvents: 'none',
          }}
        >
          {element.content}
        </div>
      )}

      {isSelected && !preview && (
        <>
          {(['nw', 'ne', 'sw', 'se', 'n', 's', 'e', 'w'] as const).map((c) => (
            <ResizeHandle key={c} corner={c} onPointerDown={(e) => startResize(e, element, c)} />
          ))}
        </>
      )}
    </div>
  );
}
