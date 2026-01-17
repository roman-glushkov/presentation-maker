import React from 'react';
import { Slide, TextElement } from '../../../../store/types/presentation';
import { getTextStyles } from '../../../shared/textStyles';
import { getSlideBackgroundStyle } from '../../../shared/slideBackground';
import '../styles/TemplatePreview.css';

interface Props {
  slide: Slide;
  scale: number;
}

export default function TemplateSlidePreview({ slide, scale }: Props) {
  const applyScale = (styles: React.CSSProperties): React.CSSProperties => {
    const scaledStyles = { ...styles };

    if (scaledStyles.fontSize) {
      const fontSize = parseFloat(scaledStyles.fontSize as string);
      scaledStyles.fontSize = `${fontSize * scale}px`;
    }

    if (scaledStyles.borderRadius) {
      const borderRadius = parseFloat(scaledStyles.borderRadius as string);
      scaledStyles.borderRadius = `${borderRadius * scale}px`;
    }

    return scaledStyles;
  };

  return (
    <div className="template-preview-container" style={getSlideBackgroundStyle(slide)}>
      {slide.elements.map((el) => {
        if (el.type !== 'text') return null;
        const textEl = el as TextElement;
        const showPlaceholder = !textEl.content && !!textEl.placeholder;
        const { dynamicTextStyle, dynamicContainerStyle, containerClasses } = getTextStyles(
          textEl,
          showPlaceholder
        );

        const scaledTextStyle = applyScale(dynamicTextStyle);
        const scaledContainerStyle = applyScale(dynamicContainerStyle);

        return (
          <div
            key={el.id}
            className={`text-element-wrapper ${containerClasses}`}
            style={{
              left: `${textEl.position.x * scale}px`,
              top: `${textEl.position.y * scale}px`,
              width: `${textEl.size.width * scale}px`,
              height: `${textEl.size.height * scale}px`,
              ...scaledContainerStyle,
            }}
          >
            <div className="text-element-content" style={scaledTextStyle}>
              {showPlaceholder ? textEl.placeholder : textEl.content || 'Текстовый блок'}
            </div>
          </div>
        );
      })}
    </div>
  );
}
