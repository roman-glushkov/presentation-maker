import React, { useEffect, useState, useCallback } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { PresentationService } from '../services/PresentationService';
import {
  Presentation,
  SlideElement,
  TextElement,
  ImageElement,
  ShapeElement,
} from '../../store/types/presentation';
import { renderShape } from '../../common/components/Workspace/utils/shapeRenderer';
import { GENERAL_NOTIFICATIONS } from '../notifications/messages';
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

    const loadPresentation = async () => {
      try {
        setLoading(true);
        const loaded = await PresentationService.getPresentation(presentationId);
        setPresentation(loaded);
      } catch {
        setError(GENERAL_NOTIFICATIONS.ERROR.SAVE_FAILED);
      } finally {
        setLoading(false);
      }
    };

    loadPresentation();
  }, [presentation, presentationId]);

  useEffect(() => {
    const handleResize = () =>
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const navigateToEditor = useCallback(() => {
    navigate(presentationId ? `/editor/${presentationId}` : '/editor');
  }, [navigate, presentationId]);

  useEffect(() => {
    if (!presentation) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowRight':
        case ' ':
        case 'PageDown':
          e.preventDefault();
          if (currentSlideIndex < presentation.slides.length - 1) {
            setCurrentSlideIndex((i) => i + 1);
          } else {
            navigateToEditor();
          }
          break;
        case 'ArrowLeft':
        case 'PageUp':
          e.preventDefault();
          if (currentSlideIndex > 0) setCurrentSlideIndex((i) => i - 1);
          break;
        case 'Escape':
          navigateToEditor();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [presentation, currentSlideIndex, navigateToEditor]);

  const handleClick = useCallback(() => {
    if (!presentation) return;
    if (currentSlideIndex < presentation.slides.length - 1) {
      setCurrentSlideIndex((i) => i + 1);
    } else {
      navigateToEditor();
    }
  }, [presentation, currentSlideIndex, navigateToEditor]);

  const handleContextMenu = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setCurrentSlideIndex((i) => Math.max(0, i - 1));
  }, []);

  const scaleX = windowSize.width / EDITOR_SLIDE_WIDTH;
  const scaleY = windowSize.height / EDITOR_SLIDE_HEIGHT;
  const scale = Math.min(scaleX, scaleY);

  const getShadowStyle = useCallback(
    (shadow?: { color: string; blur: number }) => {
      if (!shadow) return 'none';
      return `0 ${2 * scale}px ${shadow.blur * scale}px ${shadow.color}`;
    },
    [scale]
  );

  const renderTextElement = useCallback(
    (el: TextElement) => {
      const x = (el.position?.x || 0) * scale;
      const y = (el.position?.y || 0) * scale;
      const width = (el.size?.width || 0) * scale;
      const height = (el.size?.height || 0) * scale;

      return (
        <div
          key={el.id}
          className="player-text-element"
          style={{
            left: x,
            top: y,
            width,
            height,
            fontFamily: el.font || 'Arial, sans-serif',
            fontSize: `${el.fontSize * scale}px`,
            color: el.color,
            backgroundColor: el.backgroundColor || 'transparent',
            textAlign: el.align || 'left',
            justifyContent:
              el.verticalAlign === 'top'
                ? 'flex-start'
                : el.verticalAlign === 'middle'
                  ? 'center'
                  : 'flex-end',
            fontWeight: el.bold ? 'bold' : 'normal',
            fontStyle: el.italic ? 'italic' : 'normal',
            textDecoration: el.underline ? 'underline' : 'none',
            textShadow: getShadowStyle(el.shadow),
            borderRadius: el.smoothing ? `${el.smoothing * scale}px` : '0',
          }}
        >
          <div
            className="player-text-content"
            style={{
              borderRadius: el.smoothing ? `${el.smoothing * scale}px` : '0',
            }}
            dangerouslySetInnerHTML={{ __html: el.content }}
          />
        </div>
      );
    },
    [scale, getShadowStyle]
  );

  const renderImageElement = useCallback(
    (el: ImageElement) => {
      const x = (el.position?.x || 0) * scale;
      const y = (el.position?.y || 0) * scale;
      const width = (el.size?.width || 0) * scale;
      const height = (el.size?.height || 0) * scale;
      const shadowStyle = getShadowStyle(el.shadow);

      return (
        <div
          key={el.id}
          className="player-image-element"
          style={{
            left: x,
            top: y,
            width,
            height,
            filter: shadowStyle !== 'none' ? `drop-shadow(${shadowStyle})` : 'none',
            borderRadius: el.smoothing ? `${el.smoothing * scale}px` : '0',
          }}
        >
          <img
            src={el.src}
            alt="Изображение"
            className="player-image"
            draggable={false}
            style={{
              borderRadius: el.smoothing ? `${el.smoothing * scale}px` : '0',
            }}
          />
        </div>
      );
    },
    [scale, getShadowStyle]
  );

  const renderShapeElement = useCallback(
    (el: ShapeElement) => {
      const x = (el.position?.x || 0) * scale;
      const y = (el.position?.y || 0) * scale;
      const width = (el.size?.width || 0) * scale;
      const height = (el.size?.height || 0) * scale;
      const shadowStyle = getShadowStyle(el.shadow);

      return (
        <div
          key={el.id}
          className="player-shape-element"
          style={{
            left: x,
            top: y,
            width,
            height,
            filter: shadowStyle !== 'none' ? `drop-shadow(${shadowStyle})` : 'none',
          }}
        >
          <svg width={width} height={height} style={{ display: 'block' }}>
            {renderShape({
              ...el,
              size: { width, height },
              strokeWidth: el.strokeWidth * scale,
            })}
          </svg>
        </div>
      );
    },
    [scale, getShadowStyle]
  );

  const renderSlideElement = useCallback(
    (el: SlideElement) => {
      switch (el.type) {
        case 'text':
          return renderTextElement(el as TextElement);
        case 'image':
          return renderImageElement(el as ImageElement);
        case 'shape':
          return renderShapeElement(el as ShapeElement);
        default:
          return null;
      }
    },
    [renderTextElement, renderImageElement, renderShapeElement]
  );

  if (loading) {
    return (
      <div className="player-loading">
        <div className="player-spinner"></div>
        <p>Загружаем презентацию...</p>
      </div>
    );
  }

  if (error || !presentation) {
    return (
      <div className="player-error">
        <p>{error || 'Презентация не найдена'}</p>
        <button onClick={() => navigate('/presentations')}>Назад к презентациям</button>
      </div>
    );
  }

  const slide = presentation.slides[currentSlideIndex];
  const slideStyle = {
    width: EDITOR_SLIDE_WIDTH * scale,
    height: EDITOR_SLIDE_HEIGHT * scale,
    backgroundColor: slide.background.type === 'color' ? slide.background.value : 'white',
    backgroundImage: slide.background.type === 'image' ? `url(${slide.background.value})` : 'none',
  };

  return (
    <div className="player-container" onClick={handleClick} onContextMenu={handleContextMenu}>
      <div className="player-slide-counter">
        {currentSlideIndex + 1} / {presentation.slides.length}
      </div>
      <div className="player-hint">
        <span>Кликните для следующего слайда • Правый клик для предыдущего • Esc для выхода</span>
      </div>
      <div className="player-slide-container">
        <div className="player-slide" style={slideStyle}>
          {slide.elements.map(renderSlideElement)}
        </div>
      </div>
    </div>
  );
}
