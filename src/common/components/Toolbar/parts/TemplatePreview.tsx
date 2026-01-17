import React from 'react';
import { Slide, TextElement } from '../../../../store/types/presentation';
import { getTextStyles } from '../../../../store/utils/textStyles';
import '../styles/TemplatePreview.css';

interface Props {
  slide: Slide;
  scale: number;
}

export default function TemplateSlidePreview({ slide, scale }: Props) {
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
      default:
        return { backgroundColor: '#ffffff' };
    }
  };

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
    <div className="template-preview-container" style={getBackgroundStyle()}>
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
