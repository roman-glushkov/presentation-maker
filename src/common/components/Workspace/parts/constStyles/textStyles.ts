import React from 'react';
import { TextElement as TextElementType } from '../../../../../store/types/presentation';

export const getTextStyles = (element: TextElementType, showPlaceholder: boolean) => {
  const dynamicTextStyle: React.CSSProperties = {
    fontFamily: element.font,
    fontSize: `${element.fontSize}px`,
    lineHeight: element.lineHeight || 1.2,
    whiteSpace: 'pre-wrap',
    fontWeight: element.bold ? 'bold' : 'normal',
    fontStyle: showPlaceholder ? 'italic' : element.italic ? 'italic' : 'normal',
    textDecoration: element.underline ? 'underline' : 'none',
    textAlign: element.align || 'left',
    color: showPlaceholder ? '#999' : element.color || '#1f2937',
    textShadow: element.shadow ? `0 2px ${element.shadow.blur}px ${element.shadow.color}` : 'none',
  };

  const dynamicContainerStyle: React.CSSProperties = {
    justifyContent:
      element.verticalAlign === 'top'
        ? 'flex-start'
        : element.verticalAlign === 'middle'
          ? 'center'
          : 'flex-end',
    backgroundColor: element.backgroundColor || 'transparent',
    borderRadius: element.smoothing ? `${element.smoothing}px` : '0',
  };

  const dynamicReflectionStyle: React.CSSProperties = {
    opacity: element.reflection || 0,
    marginTop: 4,
  };

  const containerClasses = `text-element-container ${showPlaceholder ? 'text-placeholder' : ''}`;

  return {
    dynamicTextStyle,
    dynamicContainerStyle,
    dynamicReflectionStyle,
    containerClasses,
  };
};
