import React from 'react';
import { TextElement as TextEl } from '../../../../../store/types/presentation';

interface Props {
  element: TextEl;
  scale: number;
}

export function TextElement({ element, scale }: Props) {
  const s = scale;

  const getShadowStyle = () => {
    if (!element.shadow) return 'none';
    return `0 ${2 * s}px ${element.shadow.blur * s}px ${element.shadow.color}`;
  };

  const justifyContent =
    element.verticalAlign === 'top'
      ? 'flex-start'
      : element.verticalAlign === 'middle'
        ? 'center'
        : 'flex-end';

  const textStyle: React.CSSProperties = {
    fontFamily: element.font,
    fontSize: `${element.fontSize * s}px`,
    lineHeight: element.lineHeight || 1.2,
    fontWeight: element.bold ? 'bold' : 'normal',
    fontStyle: element.italic ? 'italic' : 'normal',
    textDecoration: element.underline ? 'underline' : 'none',
    textAlign: element.align || 'left',
    color: element.color || '#1f2937',
    whiteSpace: 'pre-wrap',
    textShadow: getShadowStyle(),
  };

  return (
    <div
      style={{
        position: 'absolute',
        left: element.position.x * s,
        top: element.position.y * s,
        width: element.size.width * s,
        height: element.size.height * s,
        backgroundColor: element.backgroundColor || 'transparent',
        display: 'flex',
        flexDirection: 'column',
        justifyContent,
        padding: 4 * s,
        boxSizing: 'border-box',
        borderRadius: element.smoothing ? `${element.smoothing * s}px` : '0',
        overflow: 'visible',
        userSelect: 'none',
      }}
    >
      <div
        style={{
          ...textStyle,
          width: '100%',
        }}
      >
        {element.content}
      </div>

      {element.reflection && element.reflection > 0 && (
        <div
          style={{
            ...textStyle,
            transform: 'scaleY(-1)',
            opacity: element.reflection,
            marginTop: 4 * s,
            maskImage: 'linear-gradient(to bottom, rgba(0,0,0,0.6), transparent)',
            WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,0.6), transparent)',
            pointerEvents: 'none',
          }}
        >
          {element.content}
        </div>
      )}
    </div>
  );
}
