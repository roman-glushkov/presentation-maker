'use client';
import React, { useState, useEffect } from 'react';
import { PresentationService } from '../services/PresentationService';
import { account, AppwriteUser } from '../client';
import './NewPresentationModal.css';

interface NewPresentationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (title: string) => void;
  onCancel: () => void;
}

export default function NewPresentationModal({
  isOpen,
  onClose,
  onCreate,
  onCancel,
}: NewPresentationModalProps) {
  const [title, setTitle] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [existingTitles, setExistingTitles] = useState<string[]>([]);

  useEffect(() => {
    if (isOpen) {
      loadUserAndTitles();
    }
  }, [isOpen]);

  const loadUserAndTitles = async () => {
    try {
      const currentUser = await account.get<AppwriteUser>();

      const presentations = await PresentationService.getUserPresentations(currentUser.$id);
      const titles = presentations.map((p) => p.title.toLowerCase().trim());
      setExistingTitles(titles);
    } catch (error: unknown) {
      console.error('Ошибка загрузки данных:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      setError('Введите название презентации');
      return;
    }

    if (trimmedTitle.length < 2) {
      setError('Название должно содержать минимум 2 символа');
      return;
    }

    if (trimmedTitle.length > 100) {
      setError('Название должно быть не длиннее 100 символов');
      return;
    }

    if (existingTitles.includes(trimmedTitle.toLowerCase())) {
      setError(
        `У вас уже есть презентация с названием "${trimmedTitle}". Придумайте уникальное название.`
      );
      return;
    }

    setLoading(true);
    try {
      onCreate(trimmedTitle);
      onClose();
      setTitle('');
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Ошибка создания презентации';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setTitle('');
    setError('');
    onCancel();
  };

  if (!isOpen) return null;

  return (
    <div className="new-presentation-modal-overlay">
      <div className="new-presentation-modal">
        <h2 className="new-presentation-modal-title">Создать новую презентацию</h2>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label className="new-presentation-modal-label">Название презентации *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                setError('');
              }}
              placeholder="Моя новая презентация"
              className={`new-presentation-modal-input ${error ? 'error' : ''}`}
              autoFocus
            />
            {error && <div className="new-presentation-modal-error">{error}</div>}
            <div className="new-presentation-modal-hint">
              Уникальное название для вашей презентации
            </div>
          </div>

          {existingTitles.length > 0 && (
            <div className="new-presentation-modal-existing-list">
              <div className="new-presentation-modal-existing-title">
                Ваши существующие презентации:
              </div>
              <div className="new-presentation-modal-existing-items">
                {existingTitles.slice(0, 5).map((title, index) => (
                  <div key={index} className="new-presentation-modal-existing-item">
                    • {title}
                  </div>
                ))}
                {existingTitles.length > 5 && (
                  <div className="new-presentation-modal-existing-more">
                    ... и еще {existingTitles.length - 5} презентаций
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="new-presentation-modal-actions">
            <button
              type="button"
              onClick={handleCancel}
              className="new-presentation-modal-cancel"
              disabled={loading}
            >
              Отмена
            </button>
            <button type="submit" className="new-presentation-modal-submit" disabled={loading}>
              {loading ? 'Создание...' : 'Создать'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
