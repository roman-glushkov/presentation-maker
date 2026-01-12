import React, { useEffect, useState, useCallback } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { PresentationService } from '../services/PresentationService';
import { Presentation } from '../../store/types/presentation';
import { SlideRenderer } from '../../store/utils/SlideRenderer';
import { GENERAL_NOTIFICATIONS } from '../notifications/messages';
import '../styles/Player.css';

const SLIDE_WIDTH = 960;
const SLIDE_HEIGHT = 540;

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
        setError(GENERAL_NOTIFICATIONS.ERROR.SAVE_FAILED);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [presentation, presentationId]);

  useEffect(() => {
    const onResize = () => setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const navigateToEditor = useCallback(() => {
    navigate(presentationId ? `/editor/${presentationId}` : '/editor');
  }, [navigate, presentationId]);

  useEffect(() => {
    if (!presentation) return;

    const onKey = (e: KeyboardEvent) => {
      if (['ArrowRight', ' ', 'PageDown'].includes(e.key)) {
        e.preventDefault();
        if (currentSlideIndex < presentation.slides.length - 1) {
          setCurrentSlideIndex((i) => i + 1);
        } else {
          navigateToEditor();
        }
      }

      if (['ArrowLeft', 'PageUp'].includes(e.key)) {
        e.preventDefault();
        setCurrentSlideIndex((i) => Math.max(0, i - 1));
      }

      if (e.key === 'Escape') {
        navigateToEditor();
      }
    };

    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
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

  if (loading) {
    return (
      <div className="player-loading">
        <div className="player-spinner" />
        <p>Загружаем презентацию...</p>
      </div>
    );
  }

  if (error || !presentation) {
    return (
      <div className="player-error">
        <p>{error || 'Презентация не найдена'}</p>
        <button onClick={() => navigate('/presentations')}>Назад</button>
      </div>
    );
  }

  const scale = Math.min(windowSize.width / SLIDE_WIDTH, windowSize.height / SLIDE_HEIGHT);

  const slide = presentation.slides[currentSlideIndex];

  return (
    <div className="player-container" onClick={handleClick} onContextMenu={handleContextMenu}>
      <div className="player-slide-counter">
        {currentSlideIndex + 1} / {presentation.slides.length}
      </div>

      <div className="player-slide-container">
        <SlideRenderer slide={slide} scale={scale} />
      </div>
    </div>
  );
}
