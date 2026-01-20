//компонент слайд шоу
import React, { useEffect, useState, useCallback } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { PresentationService } from '../services/PresentationService';
import { Presentation } from '../../store/types/presentation';
import { SlideRenderer } from '../../common/shared/SlideRenderer';
import { PLAYER_NOTIFICATIONS } from '../notifications';
import '../styles/Player.css';
//константы моего салйда
const SLIDE_WIDTH = 960;
const SLIDE_HEIGHT = 540;

export default function Player() {
  //псоздаем консанты и берем значнию из редукса
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
        setError(PLAYER_NOTIFICATIONS.ERROR.LOAD_FAILED);
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
  //функция - кнопка плеер работает только из эдитора
  const navigateToEditor = useCallback(() => {
    navigate(presentationId ? `/editor/${presentationId}` : '/editor');
  }, [navigate, presentationId]);

  useEffect(() => {
    if (!presentation) return;
    //кнопки переключения слайдов
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
      //эскейп - выход из плеера
      if (e.key === 'Escape') {
        navigateToEditor();
      }
    };

    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [presentation, currentSlideIndex, navigateToEditor]);
  //клик - переход к следующему слайду, если слайды закончились то возвращаемся в эдитор
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
    //сам рисовщик плеера
    return (
      <div className="player-loading">
        <div className="player-spinner" />
        <p>{PLAYER_NOTIFICATIONS.INFO.LOADING}</p>
      </div>
    );
  }

  if (error || !presentation) {
    return (
      <div className="player-error">
        <p>{error || PLAYER_NOTIFICATIONS.ERROR.NOT_FOUND}</p>
        <button onClick={() => navigate('/presentations')}>Назад</button>
      </div>
    );
  }

  const scale = Math.min(windowSize.width / SLIDE_WIDTH, windowSize.height / SLIDE_HEIGHT); //находим значение scale, чтобы слайд был на полный экран

  const slide = presentation.slides[currentSlideIndex];

  return (
    <div className="player-container" onClick={handleClick} onContextMenu={handleContextMenu}>
      <div className="player-slide-counter">
        {currentSlideIndex + 1} / {presentation.slides.length}
      </div>

      <div className="player-slide-container">
        //главная штука с помощью котроой и происходит весь рендеринг
        <SlideRenderer slide={slide} scale={scale} />
      </div>
    </div>
  );
}
