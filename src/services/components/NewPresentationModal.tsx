'use client';
import React, { useState, useEffect } from 'react';
import { PresentationService } from '../services/PresentationService';
import { account, AppwriteUser } from '../client';
import '../styles/NewPresentationModal.css';
import { useNotifications } from '../hooks/useNotifications';
import {
  validatePresentationTitle,
  getPresentationValidationMessage,
} from '../notifications/validation';

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
  const [loading, setLoading] = useState(false);
  const [existingTitles, setExistingTitles] = useState<string[]>([]);
  const [touched, setTouched] = useState(false);
  const [, setNextPresentationNumber] = useState(1);

  const {
    addValidationMessage,
    removeValidationMessage,
    clearValidationMessages,
    getValidationMessage,
    hasValidationErrors,
  } = useNotifications();

  useEffect(() => {
    if (isOpen) {
      account
        .get<AppwriteUser>()
        .then((currentUser) => PresentationService.getUserPresentations(currentUser.$id))
        .then((presentations) => {
          const titles = presentations.map((p) => p.title?.toLowerCase().trim() || '');
          setExistingTitles(titles.filter((t) => t));

          const baseName = 'моя презентация';
          let maxNumber = 0;

          titles.forEach((title) => {
            const lowerTitle = title.toLowerCase();
            if (lowerTitle.startsWith(baseName)) {
              const match = lowerTitle.match(new RegExp(`^${baseName}\\s*(\\d+)$`));
              if (match && match[1]) {
                const num = parseInt(match[1], 10);
                if (num > maxNumber) {
                  maxNumber = num;
                }
              }
            }
          });

          setNextPresentationNumber(maxNumber + 1);
          setTitle(`Моя презентация ${maxNumber + 1}`);
        });

      clearValidationMessages();
      setTouched(false);
    }
  }, [isOpen, clearValidationMessages]);

  useEffect(() => {
    if (!touched) return;

    const trimmedTitle = title.trim();
    removeValidationMessage('title');

    const validation = validatePresentationTitle(title, existingTitles);
    if (!validation.isValid && validation.error) {
      const message =
        validation.message || getPresentationValidationMessage(validation.error, trimmedTitle);
      addValidationMessage('title', message, 'error');
    }
  }, [title, touched, existingTitles, addValidationMessage, removeValidationMessage]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    if (!touched) setTouched(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!touched) setTouched(true);

    const trimmedTitle = title.trim();
    const validation = validatePresentationTitle(title, existingTitles);

    if (!validation.isValid) return;

    setLoading(true);
    await onCreate(trimmedTitle);
    onClose();
    clearValidationMessages();
    setTouched(false);
    setLoading(false);
  };

  const handleCancel = () => {
    clearValidationMessages();
    setTouched(false);
    onCancel();
  };

  if (!isOpen) return null;

  const trimmedTitle = title.trim();
  const titleError = getValidationMessage('title');

  return (
    <div className="new-presentation-modal-overlay">
      <div className="new-presentation-modal">
        <h2 className="new-presentation-modal-title">Создать новую презентацию</h2>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <div className="new-presentation-modal-label-container">
              <label className="new-presentation-modal-label">Название презентации</label>
            </div>

            <input
              type="text"
              value={title}
              onChange={handleTitleChange}
              className={`new-presentation-modal-input ${titleError ? 'error' : ''}`}
              autoFocus
              disabled={loading}
            />

            {titleError && (
              <div className="new-presentation-modal-error">
                <span>{titleError}</span>
              </div>
            )}
          </div>

          {existingTitles.length > 0 && (
            <div className="new-presentation-modal-existing-list">
              <div className="new-presentation-modal-existing-title">
                Ваши существующие презентации ({existingTitles.length}):
              </div>
              <div className="new-presentation-modal-existing-items">
                {existingTitles.slice(0, 5).map((existingTitle, index) => (
                  <div key={index} className="new-presentation-modal-existing-item">
                    • {existingTitle}
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
            <button
              type="submit"
              className="new-presentation-modal-submit"
              disabled={loading || !trimmedTitle || hasValidationErrors()}
            >
              {loading ? 'Создание...' : 'Создать'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
