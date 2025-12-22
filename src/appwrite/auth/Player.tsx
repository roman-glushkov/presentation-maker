import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { PresentationService } from '../services/PresentationService';
import {
  Presentation,
  SlideElement,
  TextElement,
  ImageElement,
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
    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (!presentation) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'PageDown') {
        e.preventDefault();
        if (currentSlideIndex < presentation.slides.length - 1) {
          setCurrentSlideIndex((i) => i + 1);
        } else {
          navigate(presentationId ? `/editor/${presentationId}` : '/editor');
        }
      }

      if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        e.preventDefault();
        if (currentSlideIndex > 0) {
          setCurrentSlideIndex((i) => i - 1);
        }
      }

      if (e.key === 'Escape') {
        navigate(presentationId ? `/editor/${presentationId}` : '/editor');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [presentation, currentSlideIndex, navigate, presentationId]);

  const handleClick = () => {
    if (!presentation) return;
    if (currentSlideIndex < presentation.slides.length - 1) {
      setCurrentSlideIndex((i) => i + 1);
    } else {
      navigate(presentationId ? `/editor/${presentationId}` : '/editor');
    }
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex((i) => i - 1);
    }
  };

  const scaleX = windowSize.width / EDITOR_SLIDE_WIDTH;
  const scaleY = windowSize.height / EDITOR_SLIDE_HEIGHT;
  const scale = Math.min(scaleX, scaleY);

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
            backgroundSize: slide.background.type === 'image' ? 'cover' : 'auto',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}
        >
          {slide.elements.map((el: SlideElement) => {
            const x = el.position?.x || 0;
            const y = el.position?.y || 0;
            const width = el.size?.width || 0;
            const height = el.size?.height || 0;

            switch (el.type) {
              case 'text': {
                const textEl = el as TextElement;
                return (
                  <div
                    key={textEl.id}
                    style={{
                      position: 'absolute',
                      left: x * scale,
                      top: y * scale,
                      width: width * scale,
                      height: height * scale,
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
                    }}
                    dangerouslySetInnerHTML={{ __html: textEl.content }}
                  />
                );
              }

              case 'image': {
                const imgEl = el as ImageElement;
                return (
                  <div
                    key={imgEl.id}
                    style={{
                      position: 'absolute',
                      left: x * scale,
                      top: y * scale,
                      width: width * scale,
                      height: height * scale,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'default',
                      userSelect: 'none',
                      pointerEvents: 'auto',
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
                      }}
                    />
                  </div>
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
