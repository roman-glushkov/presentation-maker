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
      className="slide-element slide-text-element"
      style={{
        left: element.position.x * s,
        top: element.position.y * s,
        width: element.size.width * s,
        height: element.size.height * s,
        backgroundColor: element.backgroundColor || 'transparent',
        justifyContent,
        padding: 4 * s,
        borderRadius: element.smoothing ? `${element.smoothing * s}px` : '0',
        overflow: 'visible',
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
    </div>
  );
}
