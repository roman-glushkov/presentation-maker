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
    if (e.key === 'Escape' || ((e.ctrlKey || e.metaKey) && e.key === 'Enter')) {
      (e.currentTarget as HTMLTextAreaElement).blur();
    }
  };

  const handleBlur = () => {
    setIsEditing(false);
  };

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
