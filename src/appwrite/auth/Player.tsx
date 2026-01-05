import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { PresentationService } from '../services/presentationService';
import {
  Presentation,
  SlideElement,
  TextElement,
  ImageElement,
  ShapeElement,
} from '../../store/types/presentation';
import '../styles/Player.css';

const EDITOR_SLIDE_WIDTH = 960;
const EDITOR_SLIDE_HEIGHT = 540;

export default function Player() {
  const navigate = useNavigate();
  const location = useLocation();
  const { presentationId } = useParams();

  const [presentation, setPresentation] = useState<Presentation | null>(
    (location.state as { presentation?: Presentation })?.presentation ?? null
  );
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [loading, setLoading] = useState(!presentation);
  const [error, setError] = useState<string | null>(null);
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    if (presentation || !presentationId) return;

    const load = async () => {
      try {
        setLoading(true);
        const loaded = await PresentationService.getPresentation(presentationId);
        setPresentation(loaded);
      } catch {
        setError('Не удалось загрузить презентацию');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [presentation, presentationId]);

  useEffect(() => {
    const handleResize = () =>
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (!presentation) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'PageDown') {
        e.preventDefault();
        if (currentSlideIndex < presentation.slides.length - 1) setCurrentSlideIndex((i) => i + 1);
        else navigate(presentationId ? `/editor/${presentationId}` : '/editor');
      }
      if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        e.preventDefault();
        if (currentSlideIndex > 0) setCurrentSlideIndex((i) => i - 1);
      }
      if (e.key === 'Escape') navigate(presentationId ? `/editor/${presentationId}` : '/editor');
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [presentation, currentSlideIndex, navigate, presentationId]);

  const handleClick = () => {
    if (!presentation) return;
    if (currentSlideIndex < presentation.slides.length - 1) setCurrentSlideIndex((i) => i + 1);
    else navigate(presentationId ? `/editor/${presentationId}` : '/editor');
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    if (currentSlideIndex > 0) setCurrentSlideIndex((i) => i - 1);
  };

  const scaleX = windowSize.width / EDITOR_SLIDE_WIDTH;
  const scaleY = windowSize.height / EDITOR_SLIDE_HEIGHT;
  const scale = Math.min(scaleX, scaleY);

  // Хелпер для получения стиля тени
  const getShadowStyle = (shadow?: { color: string; blur: number }) => {
    if (!shadow) return 'none';
    return `0 ${2 * scale}px ${shadow.blur * scale}px ${shadow.color}`;
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
    const w = el.size.width * scale;
    const h = el.size.height * scale;
    const sw = el.strokeWidth * scale;
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
            rx={0}
            ry={0}
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
        const bodyHeight = h - 16 * scale - sw;
        const cx = w / 2;
        const r = 12 * scale;
        const tailW = 24 * scale;
        const tailH = 16 * scale;
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
            rx={0}
            ry={0}
            style={{
              filter: shadowStyle !== 'none' ? `drop-shadow(${shadowStyle})` : 'none',
            }}
          />
        );
    }
  };

  if (loading)
    return (
      <div className="player-loading">
        <div className="player-spinner"></div>
        <p>Загружаем презентацию...</p>
      </div>
    );
  if (error || !presentation)
    return (
      <div className="player-error">
        <p>{error || 'Презентация не найдена'}</p>
        <button onClick={() => navigate('/presentations')}>Назад к презентациям</button>
      </div>
    );

  const slide = presentation.slides[currentSlideIndex];

  return (
    <div className="player-container" onClick={handleClick} onContextMenu={handleContextMenu}>
      <div className="player-slide-counter">
        {currentSlideIndex + 1} / {presentation.slides.length}
      </div>
      <div className="player-hint">
        <span>Кликните для следующего слайда • Правый клик для предыдущего • Esc для выхода</span>
      </div>
      <div className="player-slide-container">
        <div
          className="player-slide"
          style={{
            width: EDITOR_SLIDE_WIDTH * scale,
            height: EDITOR_SLIDE_HEIGHT * scale,
            backgroundColor: slide.background.type === 'color' ? slide.background.value : 'white',
            backgroundImage:
              slide.background.type === 'image' ? `url(${slide.background.value})` : 'none',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {slide.elements.map((el: SlideElement) => {
            const x = (el.position?.x || 0) * scale;
            const y = (el.position?.y || 0) * scale;
            const width = (el.size?.width || 0) * scale;
            const height = (el.size?.height || 0) * scale;

            switch (el.type) {
              case 'text': {
                const textEl = el as TextElement;
                const isColoredReflection = textEl.reflection === 0.6;

                return (
                  <div
                    key={textEl.id}
                    style={{
                      position: 'absolute',
                      left: x,
                      top: y,
                      width,
                      height,
                      fontFamily: textEl.font || 'Arial, sans-serif',
                      fontSize: `${textEl.fontSize * scale}px`,
                      color: textEl.color,
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
                      padding: 4 * scale,
                      boxSizing: 'border-box',
                      whiteSpace: 'pre-wrap',
                      fontWeight: textEl.bold ? 'bold' : 'normal',
                      fontStyle: textEl.italic ? 'italic' : 'normal',
                      textDecoration: textEl.underline ? 'underline' : 'none',
                      border: 'none',
                      // Применяем эффекты
                      textShadow: getShadowStyle(textEl.shadow),
                      borderRadius: textEl.smoothing ? `${textEl.smoothing * scale}px` : '0',
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
                        borderRadius: textEl.smoothing ? `${textEl.smoothing * scale}px` : '0',
                      }}
                      dangerouslySetInnerHTML={{ __html: textEl.content }}
                    />

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
              case 'image': {
                const imgEl = el as ImageElement;
                const shadowStyle = getShadowStyle(imgEl.shadow);

                return (
                  <div
                    key={imgEl.id}
                    style={{
                      position: 'absolute',
                      left: x,
                      top: y,
                      width,
                      height,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'default',
                      userSelect: 'none',
                      pointerEvents: 'auto',
                      // Применяем эффекты
                      filter: shadowStyle !== 'none' ? `drop-shadow(${shadowStyle})` : 'none',
                      borderRadius: imgEl.smoothing ? `${imgEl.smoothing * scale}px` : '0',
                      overflow: 'hidden',
                    }}
                  >
                    <img
                      src={imgEl.src}
                      alt="Изображение"
                      draggable={false}
                      style={{
                        width: width === 0 ? 'auto' : '100%',
                        height: height === 0 ? 'auto' : '100%',
                        objectFit: 'fill',
                        userSelect: 'none',
                        borderRadius: imgEl.smoothing ? `${imgEl.smoothing * scale}px` : '0',
                      }}
                    />
                  </div>
                );
              }
              case 'shape': {
                const shapeEl = el as ShapeElement;
                return (
                  <svg
                    key={shapeEl.id}
                    width={width}
                    height={height}
                    style={{ position: 'absolute', left: x, top: y }}
                  >
                    {renderShape(shapeEl)}
                  </svg>
                );
              }
              default:
                return null;
            }
          })}
        </div>
      </div>
    </div>
  );
}
