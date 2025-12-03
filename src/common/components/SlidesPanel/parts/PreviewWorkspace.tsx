import React from 'react';
import {
  Slide,
  SlideElement,
  TextElement,
  ImageElement,
} from '../../../../store/types/presentation';

interface Props {
  slide: Slide;
  scale: number;
}

export function SlidePreview({ slide, scale }: Props) {
  const s = scale;

  return (
    <div className="slide-preview-wrapper">
      <div
        className="slide-preview"
        style={{
          width: 960 * s,
          height: 540 * s,
          backgroundColor: slide.background.type === 'color' ? slide.background.value : 'white',
        }}
      >
        {slide.elements.map((el: SlideElement) => {
          if (el.type === 'text') {
            const textEl = el as TextElement;
            return (
              <div
                key={el.id}
                style={{
                  position: 'absolute',
                  left: textEl.position.x * s,
                  top: textEl.position.y * s,
                  width: textEl.size.width * s,
                  height: textEl.size.height * s,
                  fontFamily: textEl.font,
                  fontSize: `${textEl.fontSize * s}px`,
                  color: textEl.color || '#1f2937',
                  backgroundColor: textEl.backgroundColor || 'transparent',
                  textAlign: textEl.align || 'left',
                  lineHeight: textEl.lineHeight || 1.2,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent:
                    textEl.verticalAlign === 'top'
                      ? 'flex-start'
                      : textEl.verticalAlign === 'middle'
                        ? 'center'
                        : 'flex-end',
                  cursor: 'default',
                  userSelect: 'none',
                  padding: 4 * s,
                  boxSizing: 'border-box',
                  whiteSpace: 'pre-wrap',
                  fontWeight: textEl.bold ? 'bold' : 'normal',
                  fontStyle: textEl.italic ? 'italic' : 'normal',
                  textDecoration: textEl.underline ? 'underline' : 'none',
                  border: 'none',
                }}
              >
                {textEl.content}
              </div>
            );
          }

          if (el.type === 'image') {
            const imageEl = el as ImageElement;
            return (
              <div
                key={el.id}
                style={{
                  position: 'absolute',
                  left: imageEl.position.x * s,
                  top: imageEl.position.y * s,
                  width: imageEl.size.width * s,
                  height: imageEl.size.height * s,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'default',
                  userSelect: 'none',
                  pointerEvents: 'auto',
                }}
              >
                <img
                  src={imageEl.src}
                  alt="Изображение"
                  draggable={false}
                  style={{
                    width: imageEl.size.width === 0 ? 'auto' : '100%',
                    height: imageEl.size.height === 0 ? 'auto' : '100%',
                    objectFit: 'fill',
                    userSelect: 'none',
                  }}
                />
              </div>
            );
          }

          return null;
        })}
      </div>
    </div>
  );
}
