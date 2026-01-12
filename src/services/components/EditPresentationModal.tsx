// EditPresentationModal.tsx
'use client';
import React, { useState, useEffect } from 'react';
import { PresentationService } from '../services/PresentationService';
import { account, AppwriteUser } from '../client';
import '../styles/EditPresentationModal.css';
import { useNotifications } from '../hooks/useNotifications';
import {
  validatePresentationTitle,
  getPresentationValidationMessage,
} from '../notifications/validation';

interface EditPresentationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (presentationId: string, newTitle: string) => Promise<void>;
  presentationId: string;
  currentTitle: string;
}

export default function EditPresentationModal({
  isOpen,
  onClose,
  onUpdate,
  presentationId,
  currentTitle,
}: EditPresentationModalProps) {
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [existingTitles, setExistingTitles] = useState<string[]>([]);
  const [touched, setTouched] = useState(false);

  const {
    addValidationMessage,
    removeValidationMessage,
    clearValidationMessages,
    getValidationMessage,
    hasValidationErrors,
  } = useNotifications();

  useEffect(() => {
    if (isOpen) {
      // Устанавливаем текущее название
      setTitle(currentTitle);

      // Загружаем существующие названия (исключая текущее)
      account
        .get<AppwriteUser>()
        .then((currentUser) => PresentationService.getUserPresentations(currentUser.$id))
        .then((presentations) => {
          const titles = presentations
            .filter((p) => (p.id || p.$id) !== presentationId)
            .map((p) => p.title?.toLowerCase().trim() || '');
          setExistingTitles(titles.filter((t) => t));
        });

      clearValidationMessages();
      setTouched(false);
    }
  }, [isOpen, currentTitle, presentationId, clearValidationMessages]);

  useEffect(() => {
    if (!touched) return;

    const trimmedTitle = title.trim();
    removeValidationMessage('title');

    // Пропускаем валидацию, если название не изменилось
    if (trimmedTitle.toLowerCase() === currentTitle.toLowerCase()) {
      return;
    }

    const validation = validatePresentationTitle(title, existingTitles);
    if (!validation.isValid && validation.error) {
      const message =
        validation.message || getPresentationValidationMessage(validation.error, trimmedTitle);
      addValidationMessage('title', message, 'error');
    }
  }, [title, touched, existingTitles, currentTitle, addValidationMessage, removeValidationMessage]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    if (!touched) setTouched(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!touched) setTouched(true);

    const trimmedTitle = title.trim();

    // Если название не изменилось, просто закрываем
    if (trimmedTitle.toLowerCase() === currentTitle.toLowerCase()) {
      onClose();
      return;
    }

    const validation = validatePresentationTitle(title, existingTitles);
    if (!validation.isValid) return;

    setLoading(true);
    try {
      await onUpdate(presentationId, trimmedTitle);
      onClose();
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    clearValidationMessages();
    setTouched(false);
    onClose();
  };

  if (!isOpen) return null;

  const trimmedTitle = title.trim();
  const titleError = getValidationMessage('title');
  const isChanged = trimmedTitle.toLowerCase() !== currentTitle.toLowerCase();

  return (
    <div className="edit-presentation-modal-overlay">
      <div className="edit-presentation-modal">
        <h2 className="edit-presentation-modal-title">Изменить название презентации</h2>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <div className="edit-presentation-modal-label-container">
              <label className="edit-presentation-modal-label">Название презентации</label>
            </div>

            <input
              type="text"
              value={title}
              onChange={handleTitleChange}
              className={`edit-presentation-modal-input ${titleError ? 'error' : ''}`}
              autoFocus
              disabled={loading}
            />

            {titleError && (
              <div className="edit-presentation-modal-error">
                <span>{titleError}</span>
              </div>
            )}
          </div>

          <div className="edit-presentation-modal-actions">
            <button
              type="button"
              onClick={handleCancel}
              className="edit-presentation-modal-cancel"
              disabled={loading}
            >
              Отмена
            </button>
            <button
              type="submit"
              className="edit-presentation-modal-submit"
              disabled={loading || !trimmedTitle || hasValidationErrors() || !isChanged}
            >
              {loading ? 'Сохранение...' : 'Сохранить'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
