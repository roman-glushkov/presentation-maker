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

  useEffect(() => {
    setLocalContent(element.content);
  }, [element.content]);

  const showPlaceholder = !element.content && element.placeholder && !isEditing;
  const isPlaceholderShown = Boolean(!element.content && element.placeholder && !isEditing);

  const { dynamicTextStyle, dynamicContainerStyle, dynamicReflectionStyle, containerClasses } =
    getTextStyles(element, isPlaceholderShown);

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!preview) setIsEditing(true);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape' || ((e.ctrlKey || e.metaKey) && e.key === 'Enter')) {
      (e.currentTarget as HTMLTextAreaElement).blur();
    }
  };

  return (
    <div
      className={containerClasses}
      onDoubleClick={handleDoubleClick}
      style={dynamicContainerStyle}
    >
      {!preview && isEditing ? (
        <textarea
          autoFocus
          value={localContent}
          placeholder={element.placeholder}
          onChange={(e) => {
            const value = e.target.value;
            setLocalContent(value);
            dispatch(updateTextContent({ elementId: element.id, content: value }));
          }}
          onKeyDown={handleKeyDown}
          onBlur={() => setIsEditing(false)}
          className="text-edit-area"
          style={dynamicTextStyle}
        />
      ) : (
        <div className="text-content" style={dynamicTextStyle}>
          {showPlaceholder ? element.placeholder : element.content}
        </div>
      )}

      {element.reflection && element.reflection > 0 && !isEditing && (
        <div
          className="text-content text-reflection"
          style={{ ...dynamicTextStyle, ...dynamicReflectionStyle }}
        >
          {element.content}
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
