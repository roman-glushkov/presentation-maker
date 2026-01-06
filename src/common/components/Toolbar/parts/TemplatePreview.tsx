import React from 'react';
import { Slide, TextElement } from '../../../../store/types/presentation';

interface Props {
  slide: Slide;
  scale: number;
}

export default function TemplateSlidePreview({ slide, scale }: Props) {
  const s = scale; // Масштаб для всего слайда

  // Определяем стили фона для превью
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
        return {
          backgroundColor: bg.value,
        };
      case 'none':
      default:
        return {
          backgroundColor: 'white',
        };
    }
  };

  return (
    <div
      style={{
        width: 960 * s,
        height: 540 * s,
        position: 'relative',
        overflow: 'hidden',
        borderRadius: '4px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        ...getBackgroundStyle(), // Используем функцию для фона
      }}
    >
      {slide.elements.map((el) => {
        // Рисуем ТОЛЬКО текстовые элементы
        if (el.type === 'text') {
          const textEl = el as TextElement;

          // Определяем, показывать ли плейсхолдер (как в TextElement.tsx)
          const showPlaceholder = !textEl.content && textEl.placeholder;

          // Цвет текста (как в TextElement.tsx)
          const textColor = showPlaceholder ? '#999' : textEl.color || '#1f2937';

          // Тень текста (если есть)
          const textShadowStyle = textEl.shadow
            ? `0 2px ${textEl.shadow.blur}px ${textEl.shadow.color}`
            : 'none';

          // Стиль текста (как в TextElement.tsx)
          const textStyle: React.CSSProperties = {
            fontFamily: textEl.font,
            fontSize: `${textEl.fontSize * s}px`,
            lineHeight: textEl.lineHeight || 1.2,
            fontWeight: textEl.bold ? 'bold' : 'normal',
            fontStyle: showPlaceholder ? 'italic' : textEl.italic ? 'italic' : 'normal',
            textDecoration: textEl.underline ? 'underline' : 'none',
            textAlign: textEl.align || 'left',
            color: textColor,
            whiteSpace: 'pre-wrap',
            textShadow: textShadowStyle,
            width: '100%',
            wordBreak: 'break-word',
          };

          return (
            <div
              key={el.id}
              style={{
                position: 'absolute',
                left: textEl.position.x * s,
                top: textEl.position.y * s,
                width: textEl.size.width * s,
                height: textEl.size.height * s,
                backgroundColor: textEl.backgroundColor || 'transparent',
                display: 'flex',
                flexDirection: 'column',
                justifyContent:
                  textEl.verticalAlign === 'top'
                    ? 'flex-start'
                    : textEl.verticalAlign === 'middle'
                      ? 'center'
                      : 'flex-end',
                userSelect: 'none',
                padding: 4 * s,
                boxSizing: 'border-box',
                border: '1px solid #d1d5db', // ТОЧНО ТАКАЯ ЖЕ СЕРАЯ ОБВОДКА
                borderRadius: textEl.smoothing ? `${textEl.smoothing * s}px` : '0',
                overflow: 'visible',
              }}
            >
              {/* Основной текст */}
              <div style={textStyle}>
                {showPlaceholder ? textEl.placeholder : textEl.content || 'Текстовый блок'}
              </div>

              {/* Отражение текста (если есть) */}
              {textEl.reflection && textEl.reflection > 0 && (
                <div
                  style={{
                    ...textStyle,
                    transform: 'scaleY(-1)',
                    opacity: textEl.reflection,
                    marginTop: 4 * s,
                    maskImage: 'linear-gradient(to bottom, rgba(0,0,0,0.6), transparent)',
                    WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,0.6), transparent)',
                    pointerEvents: 'none',
                  }}
                >
                  {textEl.content || textEl.placeholder}
                </div>
              )}
            </div>
          );
        }

        // Все остальные типы элементов игнорируем
        return null;
      })}
    </div>
  );
}
