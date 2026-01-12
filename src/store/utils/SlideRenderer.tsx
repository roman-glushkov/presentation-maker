import React, { useCallback } from 'react';
import {
  Slide,
  SlideElement,
  TextElement,
  ImageElement,
  ShapeElement,
} from '../../store/types/presentation';
import { renderShape } from './shapeRenderer';

const EDITOR_SLIDE_WIDTH = 960;
const EDITOR_SLIDE_HEIGHT = 540;

interface Props {
  slide: Slide;
  scale: number;
}

export function SlideRenderer({ slide, scale }: Props) {
  const getShadowStyle = useCallback(
    (shadow?: { color: string; blur: number }) => {
      if (!shadow) return 'none';
      return `0 ${2 * scale}px ${shadow.blur * scale}px ${shadow.color}`;
    },
    [scale]
  );

  const renderTextElement = (el: TextElement) => {
    const x = el.position.x * scale;
    const y = el.position.y * scale;
    const width = el.size.width * scale;
    const height = el.size.height * scale;

    const justifyContent =
      el.verticalAlign === 'top'
        ? 'flex-start'
        : el.verticalAlign === 'middle'
          ? 'center'
          : 'flex-end';

    const alignItems =
      el.align === 'center' ? 'center' : el.align === 'right' ? 'flex-end' : 'flex-start';

    return (
      <div
        key={el.id}
        className="player-text-element"
        style={{
          left: x,
          top: y,
          width,
          height,
          backgroundColor: el.backgroundColor || 'transparent',
          display: 'flex',
          flexDirection: 'column',
          justifyContent,
          alignItems,
          boxSizing: 'border-box',
          padding: `${4 * scale}px`,
          borderRadius: el.smoothing ? `${el.smoothing * scale}px` : '0',
        }}
      >
        <div
          className="player-text-content"
          style={{
            fontFamily: el.font,
            fontSize: `${el.fontSize * scale}px`,
            lineHeight: el.lineHeight || 1.2,
            fontWeight: el.bold ? 'bold' : 'normal',
            fontStyle: el.italic ? 'italic' : 'normal',
            textDecoration: el.underline ? 'underline' : 'none',
            textAlign: el.align || 'left',
            color: el.color,
            whiteSpace: 'pre-wrap',
            textShadow: getShadowStyle(el.shadow),
          }}
          dangerouslySetInnerHTML={{ __html: el.content }}
        />
      </div>
    );
  };

  const renderImageElement = (el: ImageElement) => {
    const x = el.position.x * scale;
    const y = el.position.y * scale;
    const width = el.size.width * scale;
    const height = el.size.height * scale;

    return (
      <div
        key={el.id}
        className="player-image-element"
        style={{
          left: x,
          top: y,
          width,
          height,
          filter: el.shadow ? `drop-shadow(${getShadowStyle(el.shadow)})` : 'none',
          borderRadius: el.smoothing ? `${el.smoothing * scale}px` : '0',
        }}
      >
        <img
          src={el.src}
          draggable={false}
          style={{
            width: '100%',
            height: '100%',
            borderRadius: el.smoothing ? `${el.smoothing * scale}px` : '0',
          }}
        />
      </div>
    );
  };

  const renderShapeElement = (el: ShapeElement) => {
    const x = el.position.x * scale;
    const y = el.position.y * scale;
    const width = el.size.width * scale;
    const height = el.size.height * scale;

    return (
      <div
        key={el.id}
        className="player-shape-element"
        style={{
          left: x,
          top: y,
          width,
          height,
          filter: el.shadow ? `drop-shadow(${getShadowStyle(el.shadow)})` : 'none',
        }}
      >
        <svg width={width} height={height}>
          {renderShape({
            ...el,
            size: { width, height },
            strokeWidth: el.strokeWidth * scale,
          })}
        </svg>
      </div>
    );
  };

  const renderSlideElement = (el: SlideElement) => {
    if (el.type === 'text') return renderTextElement(el);
    if (el.type === 'image') return renderImageElement(el);
    if (el.type === 'shape') return renderShapeElement(el);
    return null;
  };

  return (
    <div
      className="player-slide"
      style={{
        width: EDITOR_SLIDE_WIDTH * scale,
        height: EDITOR_SLIDE_HEIGHT * scale,
        backgroundColor: slide.background.type === 'color' ? slide.background.value : 'white',
        backgroundImage:
          slide.background.type === 'image' ? `url(${slide.background.value})` : 'none',
      }}
    >
      {slide.elements.map(renderSlideElement)}
    </div>
  );
}
