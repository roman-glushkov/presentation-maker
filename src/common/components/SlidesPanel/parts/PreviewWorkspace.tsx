import React from 'react';
import {
  Slide,
  SlideElement,
  TextElement,
  ImageElement,
  ShapeElement,
} from '../../../../store/types/presentation';

interface Props {
  slide: Slide;
  scale: number;
}

export function SlidePreview({ slide, scale }: Props) {
  const s = scale;

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
          backgroundColor: '#fff',
        };
    }
  };

  // Хелпер для получения стиля тени
  const getShadowStyle = (shadow?: { color: string; blur: number }) => {
    if (!shadow) return 'none';
    return `0 ${2 * s}px ${shadow.blur * s}px ${shadow.color}`;
  };

  // Хелпер для отражения текста
  const getTextReflectionStyle = (
    reflection?: number,
    color?: string,
    isColored?: boolean
  ): React.CSSProperties => {
    if (!reflection || reflection <= 0) {
      return { display: 'none' };
    }

    // Определяем, цветное ли отражение (значение 0.6 соответствует цветному в константах)
    const colored = isColored || reflection === 0.6;

    if (colored && color) {
      const opacityHex = Math.round(reflection * 255)
        .toString(16)
        .padStart(2, '0');
      const baseColor = color.startsWith('#') ? color.substring(0, 7) : color;

      return {
        position: 'absolute',
        bottom: '-100%',
        left: 0,
        width: '100%',
        height: '100%',
        background: `linear-gradient(to bottom, ${baseColor}${opacityHex} 0%, ${baseColor}00 100%)`,
        transform: 'scaleY(-1)',
        opacity: reflection,
        pointerEvents: 'none',
      };
    } else {
      return {
        position: 'absolute',
        bottom: '-100%',
        left: 0,
        width: '100%',
        height: '100%',
        background: `linear-gradient(to bottom, rgba(255,255,255,${reflection}) 0%, rgba(255,255,255,0) 100%)`,
        transform: 'scaleY(-1)',
        opacity: reflection,
        pointerEvents: 'none',
      };
    }
  };

  const renderShape = (el: ShapeElement) => {
    const w = el.size.width * s;
    const h = el.size.height * s;
    const sw = el.strokeWidth * s;
    const fill = el.fill;
    const stroke = el.stroke;
    const radius = Math.min(w, h) / 2;

    // Стиль для тени фигуры
    const shadowStyle = getShadowStyle(el.shadow);

    const polygon = (points: string) => (
      <polygon
        points={points}
        fill={fill}
        stroke={stroke}
        strokeWidth={sw}
        strokeLinejoin="round"
        style={{
          filter: shadowStyle !== 'none' ? `drop-shadow(${shadowStyle})` : 'none',
        }}
      />
    );

    const path = (d: string) => (
      <path
        d={d}
        fill={fill}
        stroke={stroke}
        strokeWidth={sw}
        strokeLinejoin="round"
        strokeLinecap="round"
        style={{
          filter: shadowStyle !== 'none' ? `drop-shadow(${shadowStyle})` : 'none',
        }}
      />
    );

    switch (el.shapeType) {
      case 'rectangle':
        return (
          <rect
            x={sw / 2}
            y={sw / 2}
            width={w - sw}
            height={h - sw}
            rx={0} // У фигур нет smoothing
            ry={0} // У фигур нет smoothing
            fill={fill}
            stroke={stroke}
            strokeWidth={sw}
            style={{
              filter: shadowStyle !== 'none' ? `drop-shadow(${shadowStyle})` : 'none',
            }}
          />
        );

      case 'circle':
        return (
          <circle
            cx={w / 2}
            cy={h / 2}
            r={radius - sw / 2}
            fill={fill}
            stroke={stroke}
            strokeWidth={sw}
            style={{
              filter: shadowStyle !== 'none' ? `drop-shadow(${shadowStyle})` : 'none',
            }}
          />
        );

      case 'triangle':
        return polygon(`${sw},${h - sw} ${w / 2},${sw} ${w - sw},${h - sw}`);

      case 'star': {
        const points: string[] = [];
        for (let i = 0; i < 10; i++) {
          const r = i % 2 === 0 ? radius * 0.6 : radius * 0.3;
          const angle = (Math.PI / 5) * i;
          points.push(`${w / 2 + r * Math.sin(angle)},${h / 2 + r * Math.cos(angle)}`);
        }
        return polygon(points.join(' '));
      }

      case 'hexagon': {
        const points: string[] = [];
        for (let i = 0; i < 6; i++) {
          const angle = (Math.PI / 3) * i;
          points.push(`${w / 2 + radius * Math.sin(angle)},${h / 2 + radius * Math.cos(angle)}`);
        }
        return polygon(points.join(' '));
      }

      case 'heart':
        return path(`
          M ${w / 2} ${h * 0.3}
          Q ${w * 0.7} ${h * 0.1} ${w * 0.8} ${h * 0.3}
          Q ${w * 0.9} ${h * 0.5} ${w / 2} ${h * 0.8}
          Q ${w * 0.1} ${h * 0.5} ${w * 0.2} ${h * 0.3}
          Q ${w * 0.3} ${h * 0.1} ${w / 2} ${h * 0.3} Z
        `);

      case 'cloud':
        return path(`
          M ${w * 0.25} ${h * 0.6}
          C ${w * 0.15} ${h * 0.6} ${w * 0.15} ${h * 0.45} ${w * 0.28} ${h * 0.45}
          C ${w * 0.3} ${h * 0.3} ${w * 0.45} ${h * 0.28} ${w * 0.5} ${h * 0.4}
          C ${w * 0.58} ${h * 0.25} ${w * 0.78} ${h * 0.3} ${w * 0.78} ${h * 0.45}
          C ${w * 0.9} ${h * 0.48} ${w * 0.88} ${h * 0.65} ${w * 0.72} ${h * 0.65}
          H ${w * 0.28}
          C ${w * 0.26} ${h * 0.65} ${w * 0.25} ${h * 0.62} ${w * 0.25} ${h * 0.6} Z
        `);

      case 'callout': {
        const bodyHeight = h - 16 * s - sw;
        const cx = w / 2;
        const r = 12 * s;
        const tailW = 24 * s;
        const tailH = 16 * s;

        return path(`
          M ${r} ${sw / 2}
          H ${w - r}
          Q ${w} ${sw / 2} ${w} ${r}
          V ${bodyHeight - r}
          Q ${w} ${bodyHeight} ${w - r} ${bodyHeight}
          H ${cx + tailW / 2}
          L ${cx} ${bodyHeight + tailH}
          L ${cx - tailW / 2} ${bodyHeight}
          H ${r}
          Q ${sw / 2} ${bodyHeight} ${sw / 2} ${bodyHeight - r}
          V ${r}
          Q ${sw / 2} ${sw / 2} ${r} ${sw / 2} Z
        `);
      }

      default:
        return (
          <rect
            x={sw / 2}
            y={sw / 2}
            width={w - sw}
            height={h - sw}
            fill={fill}
            stroke={stroke}
            strokeWidth={sw}
            rx={0} // У фигур нет smoothing
            ry={0} // У фигур нет smoothing
            style={{
              filter: shadowStyle !== 'none' ? `drop-shadow(${shadowStyle})` : 'none',
            }}
          />
        );
    }
  };

  return (
    <div className="slide-preview-wrapper">
      <div
        className="slide-preview"
        style={{
          width: 960 * s,
          height: 540 * s,
          position: 'relative',
          overflow: 'hidden',
          ...getBackgroundStyle(), // Используем ту же функцию для фона
        }}
      >
        {slide.elements.map((el: SlideElement) => {
          if (el.type === 'text') {
            const textEl = el as TextElement;
            const isColoredReflection = textEl.reflection === 0.6;

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
                  // Применяем эффекты
                  textShadow: getShadowStyle(textEl.shadow),
                  borderRadius: textEl.smoothing ? `${textEl.smoothing * s}px` : '0',
                  overflow: 'visible',
                }}
              >
                {/* Основное содержимое текста */}
                <div
                  style={{
                    width: '100%',
                    height: '100%',
                    position: 'relative',
                    overflow: 'hidden',
                    borderRadius: textEl.smoothing ? `${textEl.smoothing * s}px` : '0',
                  }}
                >
                  {textEl.content}
                </div>

                {/* Отражение текста */}
                {textEl.reflection && textEl.reflection > 0 && (
                  <div
                    style={getTextReflectionStyle(
                      textEl.reflection,
                      textEl.color,
                      isColoredReflection
                    )}
                  />
                )}
              </div>
            );
          }

          if (el.type === 'image') {
            const imageEl = el as ImageElement;
            const shadowStyle = getShadowStyle(imageEl.shadow);

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
                  // Применяем эффекты
                  filter: shadowStyle !== 'none' ? `drop-shadow(${shadowStyle})` : 'none',
                  borderRadius: imageEl.smoothing ? `${imageEl.smoothing * s}px` : '0',
                  overflow: 'hidden',
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
                    borderRadius: imageEl.smoothing ? `${imageEl.smoothing * s}px` : '0',
                  }}
                />
              </div>
            );
          }

          if (el.type === 'shape') {
            const shapeEl = el as ShapeElement;
            return (
              <svg
                key={el.id}
                width={shapeEl.size.width * s}
                height={shapeEl.size.height * s}
                style={{
                  position: 'absolute',
                  left: shapeEl.position.x * s,
                  top: shapeEl.position.y * s,
                }}
              >
                {renderShape(shapeEl)}
              </svg>
            );
          }

          return null;
        })}
      </div>
    </div>
  );
}
