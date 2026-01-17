import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { updateTextContent } from '../../../../store/editorSlice';
import { TextElement as TextElementType, SlideElement } from '../../../../store/types/presentation';
import { createElementComponent } from './BaseElement';
import { getTextStyles } from '../../../../store/utils/textStyles';

interface TextElementProps {
  elementId: string;
  preview: boolean;
  selectedElementIds: string[];
  onElementClick: (e: React.MouseEvent, elementId: string) => void;
  getAllElements: () => SlideElement[];
}

type ListMarker = { type: 'static'; value: string };

const STATIC_MARKERS = ['• ', '○ ', '▪ ', '→ ', '✓ ', '⭐ '];

const parseListMarker = (line: string): ListMarker | null => {
  const staticMarker = STATIC_MARKERS.find((m) => line.startsWith(m));
  if (staticMarker) return { type: 'static', value: staticMarker };

  return null;
};

const getNextMarker = (marker: ListMarker): string => {
  return marker.value;
};

const TextElementRenderer = ({
  element,
  preview,
}: {
  element: TextElementType;
  preview: boolean;
}) => {
  const dispatch = useDispatch();
  const [isEditing, setIsEditing] = useState(false);
  const [localContent, setLocalContent] = useState(element.content || '');
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setLocalContent(element.content);
  }, [element.content]);

  const showPlaceholder = !element.content && element.placeholder && !isEditing;
  const isPlaceholderShown = Boolean(!element.content && element.placeholder && !isEditing);

  const { dynamicTextStyle, dynamicContainerStyle, containerClasses } = getTextStyles(
    element,
    isPlaceholderShown
  );

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!preview) {
      setIsEditing(true);
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.focus();
          textareaRef.current.selectionStart = textareaRef.current.selectionEnd =
            localContent.length;
        }
      }, 0);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    const textarea = e.currentTarget as HTMLTextAreaElement;

    if (e.key === 'Escape' || ((e.ctrlKey || e.metaKey) && e.key === 'Enter')) {
      textarea.blur();
      return;
    }

    if (e.key === 'Enter' && element.listType !== 'bullet_none') {
      const cursor = textarea.selectionStart;
      const textBefore = localContent.slice(0, cursor);
      const textAfter = localContent.slice(cursor);
      const linesBefore = textBefore.split('\n');
      const prevLine = linesBefore[linesBefore.length - 1];

      let marker = parseListMarker(prevLine);
      if (!marker && linesBefore.length > 1) {
        const prevPrevLine = linesBefore[linesBefore.length - 2];
        const prevMarker = parseListMarker(prevPrevLine);
        if (prevMarker) marker = prevMarker;
      }

      e.preventDefault();

      let nextMarkerStr = '';
      if (marker) {
        const textAfterMarker = prevLine.slice(marker.value.length).trim();
        if (textAfterMarker.length > 0) nextMarkerStr = getNextMarker(marker);
      }

      const newText = textBefore + '\n' + nextMarkerStr + textAfter;
      setLocalContent(newText);
      dispatch(updateTextContent({ elementId: element.id, content: newText }));

      requestAnimationFrame(() => {
        const newCursorPos = cursor + 1 + nextMarkerStr.length;
        textarea.selectionStart = textarea.selectionEnd = newCursorPos;
      });
    }
  };

  const handleBlur = () => setIsEditing(false);

  return (
    <div
      className={containerClasses}
      onDoubleClick={handleDoubleClick}
      style={dynamicContainerStyle}
      data-text-editing={isEditing}
    >
      {!preview && isEditing ? (
        <textarea
          ref={textareaRef}
          autoFocus
          value={localContent}
          placeholder={element.placeholder}
          onChange={(e) => {
            const value = e.target.value;
            setLocalContent(value);
            dispatch(updateTextContent({ elementId: element.id, content: value }));
          }}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          className="text-edit-area"
          style={dynamicTextStyle}
          onClick={(e) => e.stopPropagation()}
          onPointerDown={(e) => e.stopPropagation()}
          data-text-editing="true"
        />
      ) : (
        <div className="text-content" style={dynamicTextStyle}>
          {showPlaceholder ? element.placeholder : element.content}
        </div>
      )}
    </div>
  );
};

const TextElementBase = createElementComponent<TextElementType>('text', (element) => (
  <TextElementRenderer element={element} preview={false} />
));

export default function TextElementView(props: TextElementProps) {
  return <TextElementBase {...props} />;
}
