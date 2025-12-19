// appwrite/auth/Player.tsx
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { PresentationService } from '../services/PresentationService';
import { Presentation } from '../../store/types/presentation';
import '../styles/Player.css';

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

  // Загружаем презентацию, если не пришла через state
  useEffect(() => {
    if (presentation || !presentationId) return;

    const load = async () => {
      try {
        setLoading(true);
        const loaded = await PresentationService.getPresentation(presentationId);
        setPresentation({
          title: loaded.title,
          slides: loaded.slides,
          currentSlideId: loaded.currentSlideId,
          selectedSlideIds: loaded.selectedSlideIds,
        });
      } catch {
        setError('Не удалось загрузить презентацию');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [presentation, presentationId]);

  // Клавиатура
  useEffect(() => {
    if (!presentation) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' && currentSlideIndex < presentation.slides.length - 1) {
        setCurrentSlideIndex((i) => i + 1);
      }

      if (e.key === 'ArrowLeft' && currentSlideIndex > 0) {
        setCurrentSlideIndex((i) => i - 1);
      }

      if (e.key === 'Escape') {
        navigate(presentationId ? `/editor/${presentationId}` : '/editor');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [presentation, currentSlideIndex, navigate, presentationId]);

  if (loading) {
    return <div className="player-loading">Загрузка…</div>;
  }

  if (error || !presentation) {
    return (
      <div className="player-empty">
        <p>{error || 'Презентация не найдена'}</p>
        <button onClick={() => navigate('/presentations')}>Назад</button>
      </div>
    );
  }

  const slide = presentation.slides[currentSlideIndex];

  return (
    <div
      className="player-container"
      onClick={() => {
        if (currentSlideIndex < presentation.slides.length - 1) {
          setCurrentSlideIndex((i) => i + 1);
        }
      }}
      onContextMenu={(e) => {
        e.preventDefault();
        if (currentSlideIndex > 0) {
          setCurrentSlideIndex((i) => i - 1);
        }
      }}
    >
      <div
        className="player-slide"
        style={{
          background:
            slide.background.type === 'color'
              ? slide.background.value
              : `url(${slide.background.value}) center / cover`,
        }}
      >
        {slide.elements.map((el) => {
          if (el.type === 'text') {
            return (
              <div
                key={el.id}
                className="player-text"
                style={{
                  left: el.x,
                  top: el.y,
                  width: el.width,
                  height: el.height,
                  position: 'absolute',
                }}
                dangerouslySetInnerHTML={{ __html: el.content }}
              />
            );
          }

          if (el.type === 'image') {
            return (
              <img
                key={el.id}
                src={el.src}
                alt=""
                className="player-image"
                style={{
                  left: el.x,
                  top: el.y,
                  width: el.width,
                  height: el.height,
                  position: 'absolute',
                }}
              />
            );
          }

          return null;
        })}
      </div>

      <div className="player-counter">
        {currentSlideIndex + 1} / {presentation.slides.length}
      </div>
    </div>
  );
}
