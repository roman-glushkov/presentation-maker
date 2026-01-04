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

  // Стиль для тени текста (тень самого текста)
  const textShadowStyle = element.shadow
    ? `0 2px ${element.shadow.blur}px ${element.shadow.color}`
    : 'none';

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!preview) {
      setLocalContent(element.content);
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
        fontFamily: element.font,
        fontSize: `${element.fontSize}px`,
        color: showPlaceholder ? '#999' : element.color || '#1f2937',
        backgroundColor: element.backgroundColor || 'transparent',
        textAlign: element.align || 'left',
        lineHeight: element.lineHeight || 1.2,
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
        whiteSpace: 'pre-wrap',
        fontWeight: element.bold ? 'bold' : 'normal',
        fontStyle: showPlaceholder ? 'italic' : element.italic ? 'italic' : 'normal',
        textDecoration: element.underline ? 'underline' : 'none',
        border: isSelected && !preview ? '2px solid #3b82f6' : '1px solid #d1d5db',
        // ПРИМЕНЯЕМ ТЕНИ
        textShadow: textShadowStyle,
        borderRadius: element.smoothing ? `${element.smoothing}px` : '0', // <-- ДОБАВЬТЕ ЭТУ СТРОКУ
        overflow: 'hidden', // <-- И ЭТУ СТРОКУ, ЧТОБЫ СОДЕРЖИМОЕ НЕ ВЫХОДИЛО ЗА СГЛАЖЕННЫЕ УГЛЫ
      }}
    >
      {preview ? (
        element.content
      ) : isEditing ? (
        <textarea
          autoFocus
          value={localContent}
          placeholder={element.placeholder}
          onChange={(e) => {
            const newContent = e.target.value;
            setLocalContent(newContent);
            dispatch(
              updateTextContent({
                elementId: elementId,
                content: newContent,
              })
            );
          }}
          onKeyDown={handleKeyDown}
          onBlur={() => setIsEditing(false)}
          style={{
            width: '100%',
            height: '100%',
            color: element.color || '#1f2937',
            backgroundColor: element.backgroundColor || 'transparent',
            border: 'none',
            outline: 'none',
            textAlign: element.align || 'left',
            fontFamily: element.font,
            fontSize: `${element.fontSize}px`,
            lineHeight: element.lineHeight || 1.2,
            fontWeight: element.bold ? 'bold' : 'normal',
            fontStyle: element.italic ? 'italic' : 'normal',
            textDecoration: element.underline ? 'underline' : 'none',
            resize: 'none',
            overflow: 'hidden',
            padding: 0,
            margin: 0,
            // Тень текста в textarea
            textShadow: textShadowStyle,
            borderRadius: element.smoothing ? `${element.smoothing}px` : '0', // <-- ДОБАВЬТЕ И ЗДЕСЬ
          }}
        />
      ) : showPlaceholder ? (
        element.placeholder
      ) : (
        element.content
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
