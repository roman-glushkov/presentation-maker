import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { updateTextContent } from '../../../../store/editorSlice';
import { TextElement as TextElementType, SlideElement } from '../../../../store/types/presentation';
import { createElementComponent } from './BaseElement';
import { getTextStyles } from './constStyles/textStyles';

interface TextElementProps {
  elementId: string;
  preview: boolean;
  selectedElementIds: string[];
  onElementClick: (e: React.MouseEvent, elementId: string) => void;
  getAllElements: () => SlideElement[];
}

type ListMarker =
  | { type: 'static'; value: string }
  | { type: 'number'; value: number; suffix: string }
  | { type: 'latin'; value: string; suffix: string }
  | { type: 'cyrillic'; value: string; suffix: string };

const parseListMarker = (line: string): ListMarker | null => {
  const numberMatch = line.match(/^(\d+)([.)])\s+/);
  if (numberMatch) {
    return { type: 'number', value: Number(numberMatch[1]), suffix: numberMatch[2] + ' ' };
  }

  const latinMatch = line.match(/^([A-Za-z])([.)])\s+/);
  if (latinMatch) {
    return { type: 'latin', value: latinMatch[1], suffix: latinMatch[2] + ' ' };
  }

  const cyrillicMatch = line.match(/^([А-Яа-яЁё])([.)])\s+/);
  if (cyrillicMatch) {
    return { type: 'cyrillic', value: cyrillicMatch[1], suffix: cyrillicMatch[2] + ' ' };
  }

  const staticMarkers = ['✓ ', '• ', '- ', '* '];
  const staticMarker = staticMarkers.find((m) => line.startsWith(m));
  if (staticMarker) return { type: 'static', value: staticMarker };

  return null;
};

const getNextMarker = (marker: ListMarker): string => {
  switch (marker.type) {
    case 'static':
      return marker.value;
    case 'number':
      return `${marker.value + 1}${marker.suffix}`;
    case 'latin': {
      const code = marker.value.charCodeAt(0);
      if (marker.value === 'Z') return `A${marker.suffix}`;
      if (marker.value === 'z') return `a${marker.suffix}`;
      return `${String.fromCharCode(code + 1)}${marker.suffix}`;
    }
    case 'cyrillic': {
      const code = marker.value.charCodeAt(0);
      if (marker.value === 'Я') return `А${marker.suffix}`;
      if (marker.value === 'я') return `а${marker.suffix}`;
      return `${String.fromCharCode(code + 1)}${marker.suffix}`;
    }
  }
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

    if (e.key !== 'Enter') return;

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
      const textAfterMarker = prevLine
        .slice(
          marker.type === 'static'
            ? marker.value.length
            : (marker.value.toString() + marker.suffix).length
        )
        .trim();
      if (textAfterMarker.length > 0) nextMarkerStr = getNextMarker(marker);
    }

    const newText = textBefore + '\n' + nextMarkerStr + textAfter;
    setLocalContent(newText);
    dispatch(updateTextContent({ elementId: element.id, content: newText }));

    requestAnimationFrame(() => {
      const newCursorPos = cursor + 1 + nextMarkerStr.length;
      textarea.selectionStart = textarea.selectionEnd = newCursorPos;
    });
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
