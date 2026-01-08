import React from 'react';
import { Slide, TextElement } from '../../../../store/types/presentation';
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
      case 'color':
        return { backgroundColor: bg.value };
      default:
        return { backgroundColor: '#ffffff' };
    }
  };

  const getTextStyle = (textEl: TextElement, showPlaceholder: boolean): React.CSSProperties => {
    return {
      fontFamily: textEl.font,
      fontSize: `${textEl.fontSize * scale}px`,
      lineHeight: textEl.lineHeight || 1.2,
      fontWeight: textEl.bold ? 'bold' : 'normal',
      fontStyle: showPlaceholder ? 'italic' : textEl.italic ? 'italic' : 'normal',
      textDecoration: textEl.underline ? 'underline' : 'none',
      textAlign: textEl.align || 'left',
      color: showPlaceholder ? '#999' : textEl.color || '#1f2937',
      textShadow: textEl.shadow ? `0 2px ${textEl.shadow.blur}px ${textEl.shadow.color}` : 'none',
    };
  };

  return (
    <div className="template-preview-container" style={getBackgroundStyle()}>
      {slide.background.type === 'none' && <div className="no-design-overlay">Без дизайна</div>}

      {slide.elements.map((el) => {
        if (el.type !== 'text') return null;
        const textEl = el as TextElement;
        const showPlaceholder = !textEl.content && !!textEl.placeholder;

        return (
          <div
            key={el.id}
            className="text-element-wrapper"
            style={{
              left: `${textEl.position.x * scale}px`,
              top: `${textEl.position.y * scale}px`,
              width: `${textEl.size.width * scale}px`,
              height: `${textEl.size.height * scale}px`,
              backgroundColor: textEl.backgroundColor || 'transparent',
              borderRadius: textEl.smoothing ? `${textEl.smoothing * scale}px` : '0',
              justifyContent:
                textEl.verticalAlign === 'top'
                  ? 'flex-start'
                  : textEl.verticalAlign === 'middle'
                    ? 'center'
                    : 'flex-end',
            }}
          >
            <div className="text-element-content" style={getTextStyle(textEl, showPlaceholder)}>
              {showPlaceholder ? textEl.placeholder : textEl.content || 'Текстовый блок'}
            </div>

            {textEl.reflection && textEl.reflection > 0 && (
              <div
                className="text-reflection"
                style={{
                  ...getTextStyle(textEl, showPlaceholder),
                  opacity: textEl.reflection,
                }}
              >
                {textEl.content || textEl.placeholder}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
